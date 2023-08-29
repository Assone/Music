import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { createStore, del, get, set } from 'idb-keyval';

const cacheStore = createStore('cache-store', 'state');

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: (client: PersistedClient) => {
      set(idbValidKey, client, cacheStore).catch((err) => {
        console.error('Error persisting client', err);
      });
    },
    restoreClient: async () => get<PersistedClient>(idbValidKey, cacheStore),
    removeClient: async () => {
      await del(idbValidKey, cacheStore);
    },
  } satisfies Persister;
}

const persister = createIDBPersister();

export default persister;
