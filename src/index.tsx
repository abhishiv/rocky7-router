/** @jsx h **/

import {
  component,
  h,
  defineContext as defineContext,
  VElement,
  Component,
  When,
  Signal,
} from "rocky7";
//import { pathToRegexp } from "path-to-regex";
import { parse, inject } from "regexparam";

// Example usage
export type ParentRouteObject = {
  pathname: string;
  parents: ParentRouteObject[];
};
export const RouterContext = defineContext<RouterObject>();
export const ParentRouteContext = defineContext<ParentRouteObject>();

export type History = typeof window.history;
export type Location = typeof window.location;

class RouterObject extends EventTarget {
  history: History;
  location: Location;
  constructor(history: History, location: Location) {
    super();
    this.history = history;
    this.location = location;
  }
  pushState(state: Record<string, any>, empty: "", path: string) {
    this.history.pushState(state, empty, path);
    this.dispatchEvent(new Event("popstate"));
  }
}

export function createRouter(
  history: History,
  location: Location
): RouterObject {
  return new RouterObject(history, location);
}

export const Route = component<{
  path: string;
  component: Component | h.JSX.Element | { (props: any): h.JSX.Element };
}>("rocky7.Router.Route", (props, { signal, wire, getContext, utils }) => {
  const ownerRouteSignal = getContext<{ pathname: string }>(ParentRouteContext);
  //  console.log("ownerRoute", ownerRouteSignal().pathname, props.path);
  wire(($: any) => {
    const ownerRoute = ownerRouteSignal($);
    //  console.log(ownerRoute, props);
  })();
  return (
    <When
      condition={($) => ownerRouteSignal($).pathname === props.path}
      views={{
        true: () => h(props.component as any),
        false: () => null,
      }}
    ></When>
  );
  //    return when(
  //      ($) => (ownerRouteSignal($).pathname === props.path ? "T" : "F"),
  //      {
  //        T: () => h(props.component),
  //        F: () => <div data-a="4" />,
  //      }
  //    );
});

export const Switch = component(
  "rocky7.Router.Switch",
  (
    props: { children: VElement[] },
    { signal, wire, getContext, createContext, utils }
  ) => {
    const activeRouteSignal = signal<null | any>("active", null);
    // todo: remove typecast
    createContext(ParentRouteContext, activeRouteSignal as any);
    const ownerRouteSignal = getContext(ParentRouteContext);

    const routerSignal = getContext(RouterContext);
    const router = routerSignal();

    const ownerRoute = ownerRouteSignal ? ownerRouteSignal() : undefined;

    const routes = props.children
      .map((el) => ({
        path: (el as any)?.p?.path,
        component: (el as any)?.p?.component,
      }))
      .filter((el) => el.component);

    //    console.log("routes", routes);

    const updateActiveRoute = ({
      route,
      params,
    }: {
      route?: { path: string };
      params?: Record<string, string>;
    } = {}) => {
      //    console.log("updateActiveRoute", route);
      if (route) {
        const currentRoute = {
          pathname: route.path,
          parents: [],
        };
        activeRouteSignal(currentRoute);
      }
    };

    router.addEventListener("popstate", () =>
      updateActiveRoute(matchRoutes(router, routes))
    );
    updateActiveRoute(matchRoutes(router, routes));
    return props.children as any;

    //    return wire(($: any) => {
    //      const activeRoute = activeRouteSignal($);
    //      console.log({ activeRoute });
    //      if (activeRoute) {
    //        const activeRouteElement = props.children.find(
    //          (el) => (el as any).p.path === activeRoute.pathname
    //        );
    //        console.log(activeRouteElement);
    //        if (activeRouteElement) {
    //          const Component = (activeRouteElement as any).p.component;
    //          console.log("Component", Component);
    //          return h(Component, {});
    //        }
    //      }
    //    });
  }
);

// Function to find the matching route for a given pathname
function matchRoutes(
  router: RouterObject,
  routes: { component: Component; path: string }[]
) {
  const pathname = router.location.pathname;
  //console.debug("matchRoutes", router.location.pathname);
  for (const route of routes) {
    const regexp = parse(route.path);
    const match = regexp.pattern.exec(pathname);

    if (match) {
      // Extract the parameters from the matched route
      const params = {};

      return {
        route,
        params,
      };
    }
  }

  // Return null if no matching route is found
  return undefined;
}

export const Link = component(
  "Router.Link",
  (props: any, { signal, wire, getContext }) => {
    const router = getContext(RouterContext);
    const activeRoute = getContext(ParentRouteContext);
    return (
      <a
        {...props}
        onClick={(e) => {
          const r = router();
          e.preventDefault();
          r.pushState({}, "", props.href);
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
);
