import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
  hydrate,
} from "@tanstack/react-query";
import { Router } from "@tanstack/react-router";
import { ReactNode } from "react";
import { routeTree } from "./services/routes";

// eslint-disable-next-line import/prefer-default-export
export const createRouter = () => {
  // Make sure you create your loader client or similar data
  // stores inside of your `createRouter` function. This ensures
  // that your data stores are unique to each request and
  // always present on both server and client.
  const queryClient = new QueryClient();

  return new Router({
    routeTree,
    defaultPreload: "intent",
    // Optionally provide your loaderClient to the router context for
    // convenience (you can provide anything you want to the router
    // context!)
    context: {
      queryClient,
    },
    // On the server, dehydrate the loader client and return it
    // to the router to get injected into `<DehydrateRouter />`
    dehydrate: () => ({
      queryClientState: dehydrate(queryClient),
    }),
    // On the client, hydrate the loader client with the data
    // we dehydrated on the server
    hydrate: (dehydrated) => {
      hydrate(queryClient, dehydrated.queryClientState);
    },
    // Optionally, we can use `Wrap` to wrap our router in the loader client provider
    Wrap: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
