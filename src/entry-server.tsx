import type { Request as ExRequest, Response as ExResponse } from 'express';
import { extname } from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom/server';
import type { ModuleNode, ViteDevServer } from 'vite';
import routes from './routes';

interface RenderContext {
  request: ExRequest;
  response: ExResponse;
  template: string;
  server: ViteDevServer;
  isProduction: boolean;
}

const resolveModule = (
  module: ModuleNode,
): {
  file: string;
  isStyle?: boolean;
  code?: string;
  isUnknow?: boolean;
  isAsset?: boolean;
}[] => {
  const { file, clientImportedModules } = module;

  if (!file) {
    return [];
  }

  const ext = extname(file);

  switch (ext) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx': {
      if (clientImportedModules.size) {
        const modules = Array.from(clientImportedModules)
          .map((module) => resolveModule(module))
          .flat()
          .filter((item) => item.isUnknow === undefined);

        return modules;
      }

      return [];
    }

    case '.css':
      return [
        {
          file,
          // eslint-disable-next-line dot-notation
          code: (module.ssrModule?.['default'] as string) || '',
          isStyle: true,
        },
      ];

    case '.json':
    case '.svg':
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.webp':
    case '.ico':
    case '.ttf':
    case '.woff':
    case '.woff2':
    case '.otf':
    case '.eot':
      return [
        {
          file,
          isAsset: true,
        },
      ];

    default:
      return [
        {
          file,
          isUnknow: true,
        },
      ];
  }
};

const getAssets = (ids: string[], server: ViteDevServer) => {
  const assets = new Map<
    string,
    {
      file: string;
      isStyle?: boolean;
      code?: string;
      isUnknow?: boolean;
      isAssets?: boolean;
    }[]
  >();

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index] as string;

    const module = server.moduleGraph.getModuleById(id);

    if (module) {
      assets.set(id, resolveModule(module));
    }
  }

  return assets;
};

const injectManifest = (
  server: ViteDevServer,
  isProduction: boolean,
  template: string,
) => {
  // eslint-disable-next-line prefer-const
  let [startTemplate, endTemplate] = template.split('<!--ssr-outlet-->');

  if (!isProduction) {
    const entry = `${server.config.root}/src/entry-client.tsx`;
    const assets = getAssets([entry], server);

    const head = Array.from(assets.values())
      .flat()
      .reduce((pre, asset) => {
        if (asset.isStyle) {
          return `${pre}
          <style type="text/css" data-vite-dev-id="${asset.file}">
          ${asset.code}
          </style>
          `;
        }

        return pre;
      }, '');

    startTemplate = startTemplate?.replace('</head>', `${head}</head>`);
  }

  return { startTemplate, endTemplate };
};

export function createFetchRequest(req: ExRequest): Request {
  const origin = `${req.protocol}://${req.headers.host}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  const headers = new Headers();
  const requestHeaders = Object.entries(req.headers);

  for (let index = 0; index < requestHeaders.length; index += 1) {
    const [key, values] = requestHeaders[index] as [
      string,
      string | string[] | undefined,
    ];

    if (values) {
      if (Array.isArray(values)) {
        values.forEach((value) => headers.append(key, value));
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    init.body = req.body;
  }

  return new Request(url.href, init);
}

export const render = async (
  _url: string,
  { request, response, template, server, isProduction }: RenderContext,
) => {
  const { startTemplate, endTemplate } = injectManifest(
    server,
    isProduction,
    template,
  );

  let didError = false;
  let abortTimer: NodeJS.Timer;

  const handler = createStaticHandler(routes);
  const remixRequest = createFetchRequest(request);
  const context = await handler.query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
    <React.StrictMode>
      <StaticRouterProvider
        router={router}
        context={context}
        nonce="the-nonce"
      />
    </React.StrictMode>,
    {
      onShellReady() {
        response.statusCode = didError ? 500 : 200;
        response.setHeader('content-type', 'text/html');
        response.write(startTemplate);

        pipe(response);
        response.write(endTemplate);
      },
      onShellError() {
        response.statusCode = 500;
        response.setHeader('content-type', 'text/html');
        response.send('<h1>Something went wrong</h1>');
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
      onAllReady() {
        clearTimeout(abortTimer as unknown as number);
      },
    },
  );

  abortTimer = setTimeout(abort, 10000);

  request.on('close', () => {
    abort();
  });
};
