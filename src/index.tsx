/** @jsx h **/

import {
  component,
  h,
  defineContext as defineContext,
  VElement,
  Component,
  When,
} from "rocky7";
//import { pathToRegexp } from "path-to-regex";
import { parse } from "regexparam";

// Example usage
export type ParentRouteObject =
  | {
      pathname: string;
      parent: ParentRouteObject;
    }
  | undefined;
export const RouterContext = defineContext<RouterObject>("RouterObject");
export const ParentRouteContext =
  defineContext<ParentRouteObject>("ParentRouteObject");

export type History = typeof window.history;
export type Location = typeof window.location;

class RouterObject extends EventTarget {
  history: History;
  location: Location;
  constructor(history: History, location: Location) {
    super();
    this.history = history;
    this.location = location;
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", (e) => {
        this.dispatchEvent(new Event("popstate"));
      });
    }
  }
  pushState(state: Record<string, any>, empty: "", path: string) {
    this.history.pushState(state, empty, path);
    this.dispatchEvent(new Event("popstate"));
  }
  navigate(path: string) {
    this.pushState({}, "", path);
  }
  getQuery() {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const obj: Record<string, string> = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      obj[pair[0]] = decodeURIComponent(pair[1]);
    }
    return obj;
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
  component: Component<any> | h.JSX.Element;
}>("rocky7.Router.Route", (props, { signal, wire, getContext, utils }) => {
  const $ownerRoute = getContext<ParentRouteObject>(ParentRouteContext);
  return (
    <When
      condition={($) => $ownerRoute($)?.pathname === props.path}
      views={{
        true: () => h(props.component as any),
        false: () => null,
      }}
    ></When>
  );
});

export const Switch = component(
  "rocky7.Router.Switch",
  (
    props: { children: VElement[]; onChange?: Function },
    { signal, wire, getContext, createContext, utils }
  ) => {
    const $activeRoute = signal<null | any>("active", null);
    // todo: remove typecast
    const $ownerRoute = getContext(ParentRouteContext);
    createContext(ParentRouteContext, $activeRoute);

    const $router = getContext(RouterContext);
    const router = $router();

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
      console.log("updateActiveRoute", route);
      if (route) {
        const currentRoute: ParentRouteObject = {
          pathname: route.path,
          parent: $ownerRoute ? $ownerRoute() : undefined,
        };

        $activeRoute(currentRoute);
        if (props.onChange) props.onChange(currentRoute);
      }
    };

    router.addEventListener("popstate", () =>
      updateActiveRoute(
        matchRoutes($ownerRoute ? $ownerRoute() : undefined, router, routes)
      )
    );
    updateActiveRoute(
      matchRoutes($ownerRoute ? $ownerRoute() : undefined, router, routes)
    );
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
  parentRoute: ParentRouteObject | undefined,
  router: RouterObject,
  routes: { component: Component; path: string }[]
) {
  let pathname = router.location.pathname.slice(1);
  const parentPath = parentRoute ? parentRoute.pathname : undefined;
  console.log(pathname, parentPath);
  if (parentPath)
    pathname = pathname.replace(new RegExp("^" + parentPath + ""), "");
  console.log("matchRoutes", parentPath, pathname, routes);
  for (const route of routes) {
    const regexp = parse("/" + route.path);
    console.log("p", "/" + pathname, "/" + route.path);
    const match = regexp.pattern.exec("/" + pathname);
    console.log("match", match);
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

export const BrowserRouter = component(
  "rocky7-router.Browser",
  (props, { createContext, signal }) => {
    createContext(
      RouterContext,
      signal("router", createRouter(window.history, window.location))
    );
    return props.children;
  }
);

export const StaticRouter = component("rocky7-router.Static", (props) => {
  return props.children;
});

export const Link = component(
  "Router.Link",
  (props: any, { signal, wire, getContext }) => {
    const $router = getContext(RouterContext);
    return (
      <a
        {...props}
        onClick={(e) => {
          e.preventDefault();
          if (!$router) {
            throw new Error("Please define root router");
          }
          const r = $router();
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
