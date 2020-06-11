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
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = this.enforceSlashInStart(baseUrl);
  }

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

  use(router: PtRouter) {
    this.subRouters.push(router);
  }

  protected getRoutes(nonFormattedUrl: string, method: string): PtRoute[] {
    const url = this.enforceSlashInStart(nonFormattedUrl);
    const ownRoutes = this.routesByUrl[url]?.filter((route) => route.method === method) ?? [];
    const subUrl = url.replace(new RegExp(`^${this.baseUrl}`), "");
    const subRoutes = url.startsWith(this.baseUrl)
      ? this.subRouters.map((router) => router.getRoutes(subUrl, method))
      : [];

    return ownRoutes.concat(...subRoutes);
  }

  private enforceSlashInStart(url: string): string {
    return url.startsWith("/") ? url : `/${url}`;
  }

  private addRoute(url: string, handler: PtHandler, method: string) {
    const formattedUrl = this.baseUrl + url.replace(/\/$/, "");
    let routes = this.routesByUrl[formattedUrl];

    if (routes == null) {
      routes = [];
      this.routesByUrl[formattedUrl] = routes;
    }

    routes.push({
      method,
      handler,
    });
  }
}
