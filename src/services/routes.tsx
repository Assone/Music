import Root from "@/Root";
import { getSearchHotList } from "@/apis/resources/search";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import {
  Route,
  lazyRouteComponent,
  rootRouteWithContext,
} from "@tanstack/react-router";
import { lastValueFrom } from "rxjs";
import { z } from "zod";
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

const resourceSearchSchema = z.object({
  keyword: z.string().or(z.undefined()),
});

export type ResourceSearchSchema = z.infer<typeof resourceSearchSchema>;

export const SearchRoute = new Route({
  getParentRoute: () => RootRoute,
  path: "/search",
  component: lazyRouteComponent(() => import("@/views/SearchView")),
  validateSearch: resourceSearchSchema,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["search", "hot"],
      queryFn: () => lastValueFrom(getSearchHotList()),
      initialData: [],
    });
  },
});

export const routeTree = RootRoute.addChildren([HomeRoute, SearchRoute]);
