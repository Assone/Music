interface Cache {
  cache?: boolean;
  cacheLike?: {
    get: (key: unknown) => undefined | unknown;
    set: (key: unknown, value: unknown, maxAge?: number) => void;
    delete: (key: unknown) => unknown;
    clear: () => void;
  };
}

declare namespace HTTP {
  interface AdapterConfig {
    cache?: boolean;
    maxAge?: number;
  }

  type Config<B> = {
    enhancer?: AdapterConfig;
  } & B;

  type RequestConfig<B = unknown> = Partial<Cache> & B;

  type InterceptorsRequest<V> = ((value: V) => V | Promise<V>) | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type InterceptorsResponse = ((error: any) => unknown) | undefined;
}
