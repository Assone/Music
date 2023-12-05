import { isClient } from './is';

export interface ConfigurableWindow {
  window?: Window;
}

export const defaultWindow = isClient ? window : undefined;
export const defaultDocument = isClient ? document : undefined;
