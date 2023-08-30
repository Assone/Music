declare namespace NodeJS {
  interface ProcessEnv {
    readonly SENTRY_DSN: string;
    readonly SENTRY_AUTH_TOKEN: string;
    readonly SENTRY_PROJECT: string;
    readonly SENTRY_ORG: string;
  }
}
