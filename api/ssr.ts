import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'node:fs';
import path from 'path';

// eslint-disable-next-line consistent-return
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { url } = request;
  console.log('request', url);

  if (!url) return response.status(400);

  const template = fs.readFileSync(
    path.resolve(process.cwd(), 'dist/client/index.html'),
    'utf-8',
  );
  const { render } = (await import(
    path.resolve(process.cwd(), './dist/server/entry-server.js')
  )) as { render: (...args: unknown[]) => Promise<void> };

  const newRequest = Object.assign(request, { protocol: 'https' });
  console.log('rendering', url);

  await render(url, {
    request: newRequest,
    response,
    template,
    isProduction: true,
  });
}
