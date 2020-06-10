import { logTime } from "./decorators";

export interface PtRequest {
  body?: object | string;
  query: Partial<Record<string, string | string[]>>;
}

export type PtHandler = (req: PtRequest) => unknown | Promise<unknown>;

export interface PtRoute {
  method: string;
  handler: PtHandler;
}

export class PtRouter {
  private routesByUrl: Partial<Record<string, PtRoute[]>> = {};
  private subRouters: PtRouter[] = [];

  constructor(private baseUrl: string = "") {}

  get(url: string, handler: PtHandler) {
    this.addRoute(url, handler, "GET");
  }

  post(url: string, handler: PtHandler) {
    this.addRoute(url, handler, "POST");
  }

  put(url: string, handler: PtHandler) {
    this.addRoute(url, handler, "PUT");
  }

  delete(url: string, handler: PtHandler) {
    this.addRoute(url, handler, "DELETE");
  }

  protected getRoutes(url: string, method: string): PtRoute[] {
    const ownRoutes = this.routesByUrl[url]?.filter((route) => route.method === method) ?? [];
    const subRoutes = this.subRouters.map((router) => router.getRoutes(url, method));
    return ownRoutes.concat(...subRoutes);
  }

  use(router: PtRouter) {
    this.subRouters.push(router);
  }

  private addRoute(url: string, handler: PtHandler, method: string) {
    let routes = this.routesByUrl[url];

    if (routes == null) {
      routes = [];
      this.routesByUrl[this.baseUrl + url] = routes;
    }

    routes.push({
      method,
      handler,
    });
  }
}
