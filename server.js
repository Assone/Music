import compression from 'compression';
import express from 'express';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5174;

async function createServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  let vite;

  if (isProduction) {
    app.use(compression());
    app.use(
      express.static(path.resolve(__dirname, 'dist/client'), { index: false }),
    );
  } else {
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    vite = await createViteServer({
      define: {
        __PORT__: port,
      },
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    });

    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    app.use(vite.middlewares);
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(
          __dirname,
          isProduction ? 'dist/client/index.html' : 'index.html',
        ),
        'utf-8',
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = isProduction
        ? template
        : await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = isProduction
        ? await import('./dist/server/entry-server.js')
        : await vite.ssrLoadModule('/src/entry-server.tsx');

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      await render(url, {
        request: req,
        response: res,
        template,
        server: vite,
        isProduction,
      });
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      console.trace(e);
      next(e);
    }
  });

  app.listen(port);
  console.log(`listening on http://localhost:${port}`);
}

createServer();
