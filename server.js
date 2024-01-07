import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

/**
 * 注入资源到模版
 * @param {string} template 模板
 * @param {Map<string, {type: string, code: string}>} map 资源集合
 */
const injectAssetsToTemplate = (template, map) => {
  let newTemplate = template;

  Array.from(map).forEach(([id, { type, code }]) => {
    switch (type) {
      case "css": {
        const tag = `
        <style type="text/css" data-vite-dev-id="${id}">
          ${code}
        </style>`;

        newTemplate = newTemplate.replace("</head>", `${tag}</head>`);
      }
    }
  });

  return newTemplate;
};

async function createServer() {
  const app = express();
  let vite;

  const isProduction = process.env.NODE_ENV === "production";
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const port = process.env.PORT || 5174;

  const injectAssetsMap = new Map();

  if (isProduction) {
  } else {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      plugins: [
        {
          enforce: "post",
          apply: "serve",
          transform(code, id, ssr) {
            if (ssr && id.endsWith(".css")) {
              const stylesheet = code.match(/__vite__css\s+=\s+"(?<css>.+)"/)
                .groups.css;

              injectAssetsMap.set(id, {
                type: "css",
                code: JSON.parse(`{"css":"${stylesheet}"}`).css,
              });
            }
          },
        },
      ],
      appType: "custom",
    });

    app.use(vite.middlewares);
  }

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(
          dirname,
          isProduction ? "dist/client/index.html" : "index.html",
        ),
        "utf-8",
      );

      if (!isProduction) {
        template = injectAssetsToTemplate(
          await vite.transformIndexHtml(url, template),
          injectAssetsMap,
        );
      }

      const { render } = isProduction
        ? await import("./dist/server/entry-server.js")
        : await vite.ssrLoadModule("./src/entry-server.tsx");

      await render({
        request: req,
        response: res,
        url,
        template,
        isProduction,
      });
    } catch (error) {
      vite?.ssrFixStacktrace(error);
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

createServer();
