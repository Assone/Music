export interface CacheLike {
  get: (key: unknown) => undefined | unknown;
  set: (key: unknown, value: unknown, maxAge?: number) => void;
  delete: (key: unknown) => unknown;
  clear: () => void;
}

class Cache {
  data: Map<unknown, { timestamp: number; maxAge: number; value: unknown } | undefined>;

  constructor() {
    this.data = new Map();
  }

  get(key: unknown) {
    const data = this.data.get(key);
    if (!data) return undefined;

    const isExpired = Date.now() - data.timestamp > data.maxAge;
    if (isExpired) this.data.delete(key);

    return isExpired ? undefined : data.value;
  }

  set(key: unknown, value: unknown, maxAge = 0) {
    this.data.set(key, {
      maxAge,
      value,
      timestamp: Date.now(),
    });
  }

  delete(key: unknown) {
    return this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }
}

export default new Cache();
