import { createMemoryHistory } from "@tanstack/react-router";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  StartServer,
  transformStreamWithRouter,
} from "@tanstack/react-router-server/server";
import type { Request, Response } from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import { isbot } from "isbot";
import { StrictMode } from "react";
import { renderToPipeableStream, type PipeableStream } from "react-dom/server";
import Html from "./Html";
import { createRouter } from "./router";
import queryClient from "./services/query-client";

interface RenderOptions {
  request: Request;
  response: Response;
  url: string;
  template: string;
  isProduction: boolean;
}

const initRouter = async (url: string) => {
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

  return router;
};

// const createTransformByTemplate = (template: string, separator: string) => {
//   const [startTemplate, endTemplate] = template.split(separator);

//   const prepend = new Transform({
//     transform(chunk, _encoding, callback) {
//       this.push(startTemplate + chunk);
//       callback();
//     },
//   });

//   const append = new Transform({
//     transform(chunk, _encoding, callback) {
//       this.push(chunk + endTemplate);
//       callback();
//     },
//   });

//   return {
//     prepend,
//     append,
//   };
// };

// eslint-disable-next-line import/prefer-default-export
export const render = async (options: RenderOptions) => {
  const { request, response, url, template } = options;

  let didError = false;

  const router = await initRouter(url);

  const startTransformPipe = (pipeableStream: PipeableStream) => {
    response.statusCode = didError ? 500 : 200;
    response.setHeader("Content-Type", "text/html");

    // const { prepend, append } = createTransformByTemplate(
    //   template,
    //   "<!--ssr-outlet-->",
    // );
    // Add our Router transform to the stream
    const transforms = [transformStreamWithRouter(router)];

    // Pipe the stream through our transforms
    const transformedStream = transforms.reduce(
      (stream, transform) => stream.pipe(transform as never),
      pipeableStream,
    );

    // Pipe the transformed stream to the response
    transformedStream.pipe(response);
  };

  const UA = request.headers["user-agent"];
  const isCrawler = isbot(UA);

  const head = template.substring(
    template.indexOf("<head>") + 6,
    template.indexOf("</head>"),
  );

  const stream = renderToPipeableStream(
    <StrictMode>
      <Html head={head}>
        <StartServer router={router} />
      </Html>
    </StrictMode>,
    {
      onShellReady() {
        if (!isCrawler) {
          startTransformPipe(stream);
        }
      },
      onAllReady() {
        if (isCrawler) {
          startTransformPipe(stream);
        }
      },
      onShellError(error) {
        response.statusCode = 500;
        response.setHeader("content-type", "text/html");
        response.send("<h1>Something went wrong</h1>");
      },
      onError: (error) => {
        didError = true;
        console.log(error);
      },
    },
  );

  const { abort } = stream;

  setTimeout(abort, 10000);

  request.on("close", abort);
};
