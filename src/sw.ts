// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

cleanupOutdatedCaches();

declare let self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

// 缓存策略和清理机制： 目前的代码中没有明确的缓存策略，比如缓存过期时间、缓存容量限制等。在实际应用中，您可能需要考虑添加合适的缓存策略，以避免缓存过期或占用过多的存储空间。
// 缓存更新策略： 当资源发生变化时，当前代码并没有实现自动更新缓存的机制。您可能需要考虑添加某种更新策略，比如在网络请求时检查资源是否有更新，然后决定是否更新缓存。
// 错误处理： 在代码中，虽然有一些错误处理，但对于缓存操作的错误处理还可以更加详细和鲁棒。例如，在添加缓存时捕获错误可能会给您更多的调试和排除问题的信息。
// 对不同资源类型的缓存处理： 目前的代码会缓存所有 GET 请求，但实际上，不同类型的资源可能需要不同的缓存策略，比如页面、图片、脚本等。

const requestCache = async (event: FetchEvent, type: string) => {
  const { request } = event;

  const cache = await caches.open(type);
  const cached = await cache.match(request);

  if (cached && cached.status === 200) {
    console.debug('%c[Cache] use cached response', 'color: #0f0;', request.url);

    event.waitUntil(cache.add(request));

    return cached;
  }

  const preload = await (event.preloadResponse as Promise<Response>);
  if (preload) {
    console.debug(
      '%c[Cache] use preload response',
      'color: #0f0;',
      request.url,
    );

    await cache.put(request, preload);
    return preload;
  }

  console.debug('%c[Cache] fetch response', 'color: #0f0;', request.url);
  const response = await fetch(request);

  cache.put(request, response.clone()).catch((err) => {
    console.debug('%c[Cache error] put response error', 'color: #f00;', err);
  });
  return response;
};

const ignoreCacheType = ['script', 'document', 'manifest', 'image', ''];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (e) => {
  const event = e;
  const { request } = event;
  const { method } = request;

  // Let the browser do its default thing
  // for non-GET requests.
  if (method !== 'GET') return;

  console.debug('[Service Worker] Fetching resource: ', request.url);

  if (ignoreCacheType.includes(request.destination)) return;

  const sourceType = request.destination || 'api';

  // Prevent the default, and handle the request ourselves.
  event.respondWith(requestCache(event, sourceType));
});
