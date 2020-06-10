export interface PtRequest {
  body?: object | string;
  query: Partial<Record<string, string | string[]>>;
}

export type PtHandler = (req: PtRequest) => unknown | Promise<unknown>;

export interface PtRoute {
  method: string;
  url: string;
  handler: PtHandler;
}

export class PtRouter {
  private routesByUrl: Partial<Record<string, PtRoute[]>> = {};

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

  getRoutes(url: string, method: string) {
    return this.routesByUrl[url]?.filter(route => route.method === method) ?? [];
  }

  private addRoute(url: string, handler: PtHandler, method: string) {
    let routes = this.routesByUrl[url];

    if (routes == null) {
      routes = [];
      this.routesByUrl[url] = routes;
    }

    routes.push({
      url,
      method,
      handler,
    });
  }
}