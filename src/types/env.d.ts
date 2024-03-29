/* eslint-disable no-underscore-dangle */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_BASEURL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// SSR
declare const __PORT__: string | undefined;
