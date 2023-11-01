import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'node:fs';
import path from 'path';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { url } = request;
  if (!url) return response.status(400);

  const template = fs.readFileSync(
    path.resolve(process.cwd(), 'dist/client/index.html'),
    'utf-8',
  );
  const { render } = await import(
    path.resolve(process.cwd(), './dist/server/entry-server.js')
  );

  await render(url, {
    request,
    response,
    template,
    isProduction: true,
  });
}
