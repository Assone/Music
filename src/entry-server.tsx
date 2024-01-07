import { dehydrate } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  StartServer,
  transformStreamWithRouter,
} from "@tanstack/react-router-server/server";
import type { Request, Response } from "express";
import { StrictMode } from "react";
import { PipeableStream, renderToPipeableStream } from "react-dom/server";
import { Transform } from "stream";
import { createRouter } from "./router";
import queryClient from "./services/query-client";

interface RenderOptions {
  request: Request;
  response: Response;
  url: string;
  template: string;
  isProduction: boolean;
}

const getRouter = async (url: string) => {
  const router = createRouter();

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  });

  router.update({
    history: memoryHistory,
    context: {
      queryClient,
    },
  });

  await router.load();

  console.log(dehydrate(queryClient));

  return router;
};

const createTransformByTemplate = (template: string, separator: string) => {
  const [startTemplate, endTemplate] = template.split(separator);

  const prepend = new Transform({
    transform(chunk, _encoding, callback) {
      this.push(startTemplate + chunk);
      callback();
    },
  });

  const append = new Transform({
    transform(chunk, _encoding, callback) {
      this.push(chunk + endTemplate);
      callback();
    },
  });

  return {
    prepend,
    append,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const render = async (options: RenderOptions) => {
  const { request, response, url, template } = options;

  const router = await getRouter(url);

  let didError = false;

  const startTransformPipe = (pipeableStream: PipeableStream) => {
    response.statusCode = didError ? 500 : 200;
    response.setHeader("Content-Type", "text/html");

    const { prepend, append } = createTransformByTemplate(
      template,
      "<!--ssr-outlet-->",
    );
    // Add our Router transform to the stream
    const transforms = [prepend, transformStreamWithRouter(router), append];

    // Pipe the stream through our transforms
    const transformedStream = transforms.reduce(
      (stream, transform) => stream.pipe(transform as never),
      pipeableStream,
    );

    // Pipe the transformed stream to the response
    transformedStream.pipe(response);
  };

  const stream = renderToPipeableStream(
    <StrictMode>
      <StartServer router={router} />
    </StrictMode>,
    {
      onShellReady() {
        startTransformPipe(stream);
      },
      onError: (err) => {
        didError = true;
        console.log(err);
      },
    },
  );

  const { abort } = stream;

  setTimeout(abort, 10000);

  request.on("close", () => {
    abort();
  });
};
