/* eslint-disable import/no-extraneous-dependencies */
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { ScrollRestoration, useLoaderData } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";
import { Suspense, lazy } from "react";
import App from "./App";
import { RootRoute } from "./services/routes";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((module) => ({
        default: module.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

const TanStackReactQueryDevtools = import.meta.env.PROD
  ? lazy(() =>
      import("@tanstack/react-query-devtools/production").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    );

const Root: React.FC = () => {
  const { dehydratedState }: { dehydratedState: DehydratedState } =
    useLoaderData({ from: RootRoute.id });

  return (
    <HydrationBoundary state={dehydratedState}>
      <App />

      <ScrollRestoration />
      <DehydrateRouter />

      <Suspense>
        <TanStackRouterDevtools
          initialIsOpen={false}
          toggleButtonProps={{
            style: {
              position: "fixed",
              top: 16,
              right: 70,
              bottom: "atuo",
              left: "auto",
            },
          }}
        />
        <TanStackReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="top-right"
        />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Root;
