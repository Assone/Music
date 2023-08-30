/* eslint-disable no-underscore-dangle */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_BASEURL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __SENTRY_DSN__: string;
declare const __SENTRY_AUTH_TOKEN__: string;
declare const __SENTRY_PROJECT__: string;
declare const __SENTRY_ORG__: string;
