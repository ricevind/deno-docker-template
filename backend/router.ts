export type RouteHandler = (request: Request) => Response | Promise<Response>;
export type RouteMatcher = (withUrl: { url: string }) => boolean;
export type Route = { matcher: RouteMatcher; handler: RouteHandler };

export class Router {
  private routes: Route[] = [];

  constructor(routes: Route[] = []) {
    this.routes = routes;
  }

  handleRequest(request: Request) {
    for (const route of this.routes) {
      if (route.matcher(request)) {
        return route.handler(request);
      }
    }

    throw (new Error(
      `[Router] Request to ${request.url} did not match any route`,
    ));
  }

  addRoute(route: Route) {
    this.routes = [route, ...this.routes];
  }
}

export const router = new Router();
