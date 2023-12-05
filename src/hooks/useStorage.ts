import { ConfigurableWindow } from '@/utils/global';
import { getValueType, isNull, isUndefined } from '@/utils/is';

type StorageValue = string | number | boolean | null | object;

interface Serializer<T> {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
}

type SerializerType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'map'
  | 'set'
  | 'object'
  | 'any';

const getSerializerType = <T>(value: T): SerializerType => {
  const type = getValueType(value);

  switch (type) {
    case 'string':
    case 'boolean':
    case 'date':
    case 'map':
    case 'set':
    case 'object':
      return type;
    case 'number':
      return Number.isNaN(value) ? 'any' : 'number';
    default:
      return 'any';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StorageSerializer: Record<SerializerType, Serializer<any>> = {
  boolean: {
    serialize: (v) => String(v),
    deserialize: (v) => v === 'true',
  },
  number: {
    serialize: (v) => String(v),
    deserialize: (v) => Number(v),
  },
  string: {
    serialize: (v) => String(v),
    deserialize: (v) => v,
  },
  date: {
    serialize: (v: Date) => v.toISOString(),
    deserialize: (v) => new Date(v),
  },
  map: {
    serialize: (v: Map<unknown, unknown>) =>
      JSON.stringify(Array.from(v.entries())),
    deserialize: (v: string) => new Map(JSON.parse(v) as []),
  },
  set: {
    serialize: (v: Set<unknown>) => JSON.stringify(Array.from(v)),
    deserialize: (v: string) => new Set(JSON.parse(v) as []),
  },
  object: {
    serialize: (v: Record<string, unknown>) => JSON.stringify(v),
    deserialize: (v: string) => JSON.parse(v) as object,
  },
  any: {
    serialize: (v) => String(v),
    deserialize: (v) => v,
  },
};

export interface UseStorageOptions<T> extends ConfigurableWindow {
  serializer?: Serializer<T>;
  onError?: (error: unknown) => void;
}

export type UseStorageReturn<S> = [S, (value: S | ((prev: S) => S)) => void];

export function useStorage(
  key: string,
  initialValue: string,
  storage?: Storage,
  options?: UseStorageOptions<string>,
): UseStorageReturn<string>;
export function useStorage(
  key: string,
  initialValue: number,
  storage?: Storage,
  options?: UseStorageOptions<number>,
): UseStorageReturn<number>;
export function useStorage(
  key: string,
  initialValue: boolean,
  storage?: Storage,
  options?: UseStorageOptions<boolean>,
): UseStorageReturn<boolean>;
export function useStorage<T>(
  key: string,
  initialValue: T,
  storage?: Storage,
  options?: UseStorageOptions<T>,
): UseStorageReturn<T>;
export function useStorage<T = unknown>(
  key: string,
  initialValue: T,
  storage?: Storage,
  options?: UseStorageOptions<T>,
): UseStorageReturn<T>;
export function useStorage<T extends StorageValue>(
  key: string,
  initialValue?: T,
  storage?: Storage,
  options: UseStorageOptions<T> = {},
): UseStorageReturn<T | undefined> {
  const type = useMemo(() => getSerializerType(initialValue), [initialValue]);
  const serializer = useMemo(
    () => options.serializer ?? StorageSerializer[type],
    [options.serializer, type],
  );

  const [data, setData] = useState<T | undefined>(() => {
    const value = storage?.getItem(key);

    return value ? (serializer.deserialize(value) as T) : initialValue;
  });

  const {
    onError = (error) => {
      console.error(error);
    },
  } = options;

  const onWrite = useCallback(
    (value?: T) => {
      try {
        if (isNull(value) || isUndefined(value)) {
          storage?.removeItem(key);
        } else {
          const serializedValue = serializer.serialize(value);
          const oldValue = storage?.getItem(key);

          if (serializedValue !== oldValue) {
            storage?.setItem(key, serializedValue);
          }
        }
      } catch (error) {
        onError(error);
      }
    },
    [key, onError, serializer, storage],
  );

  const onRead = useCallback(
    (newValue?: string | null): T | undefined => {
      try {
        const value = newValue ?? storage?.getItem(key);

        if (isNull(value) || isUndefined(value)) {
          return initialValue;
        }

        return serializer.deserialize(value) as T;
      } catch (error) {
        onError(error);
      }

      return undefined;
    },
    [initialValue, key, onError, serializer, storage],
  );

  const onUpdate = useCallback(
    (event?: StorageEvent) => {
      if (event?.storageArea !== storage) {
        return;
      }

      if (event?.key === null) {
        setData(initialValue);

        return;
      }

      if (event?.key !== key) {
        return;
      }

      try {
        const serializedValue = data ? serializer.serialize(data) : null;

        if (serializedValue !== event.newValue) {
          setData(onRead(event.newValue));
        }
      } catch (error) {
        onError(error);
      }
    },
    [data, initialValue, key, onError, onRead, serializer, storage],
  );

  useEffect(() => {
    onWrite(data);
  }, [data, onWrite]);

  useEffect(() => {
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener('storage', onUpdate);
    };
  }, [onUpdate]);

  return [data, setData];
}
