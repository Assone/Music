import * as Sentry from '@sentry/react';
import { createRoutesFromChildren, matchRoutes } from 'react-router-dom';

Sentry.init({
  environment: import.meta.env.MODE,
  dsn: __SENTRY_DSN__,
  integrations: [new Sentry.BrowserProfilingIntegration()],
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

Sentry.onLoad(() => {
  const client = Sentry.getCurrentHub().getClient();

  client?.addIntegration?.(
    new Sentry.Replay({ maskAllText: true, blockAllMedia: true }),
  );
  client?.addIntegration?.(
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost'],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
  );
});
