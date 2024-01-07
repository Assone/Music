import Root from "@/Root";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Route,
  lazyRouteComponent,
  rootRouteWithContext,
} from "@tanstack/react-router";
import queryClient from "./query-client";

export interface RouterContext {
  queryClient: QueryClient;
}

export const RootRoute = rootRouteWithContext<RouterContext>()({
  component: Root,
  loader: () => ({ dehydratedState: dehydrate(queryClient) }),
});

export const HomeRoute = new Route({
  getParentRoute: () => RootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/views/HomeView")),
});

export const AboutRoute = new Route({
  getParentRoute: () => RootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

export const routeTree = RootRoute.addChildren([HomeRoute, AboutRoute]);
