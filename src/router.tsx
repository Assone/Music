import { Router } from "@tanstack/react-router";
import queryClient from "./services/query-client";
import { routeTree } from "./services/routes";

// eslint-disable-next-line import/prefer-default-export
export const createRouter = () =>
  new Router({
    routeTree,
    defaultPreload: "intent",
    context: {
      queryClient,
    },
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
