export interface PtRequest {
  body?: object | string;
  query: Partial<Record<string, string | string[]>>;
}

export type PtHandler = (req: PtRequest) => unknown | Promise<unknown>;

export type PtRouteMethod =
  | "get"
  | "post"
  | "put"
  | "delete";

export interface PtRoute {
  method: string;
  handler: PtHandler;
}

export class PtRouter {
  private routesByUrl: Partial<Record<string, PtRoute[]>> = {};
  private subRouters: PtRouter[] = [];
  private basePath: string;

  constructor(basePath: string = "") {
    this.basePath = this.enforceSlashInStart(basePath);
  }

  get(path: string, handler: PtHandler) {
    return this.addRoute(path, handler, "get");
  }

  post(path: string, handler: PtHandler) {
    return this.addRoute(path, handler, "post");
  }

  put(path: string, handler: PtHandler) {
    return this.addRoute(path, handler, "put");
  }

  delete(path: string, handler: PtHandler) {
    return this.addRoute(path, handler, "delete");
  }

  use(router: PtRouter) {
    this.subRouters.push(router);
    return this;
  }

  protected getRoutes(nonFormattedPath: string, method: string): PtRoute[] {
    const path = this.enforceSlashInStart(nonFormattedPath);
    const ownRoutes = this.routesByUrl[path]?.filter((route) => route.method === method) ?? [];
    const subPath = path.replace(new RegExp(`^${this.basePath}`), "");
    const subRoutes = path.startsWith(this.basePath)
      ? this.subRouters.map((router) => router.getRoutes(subPath, method))
      : [];

    return ownRoutes.concat(...subRoutes);
  }

  private enforceSlashInStart(path: string): string {
    return path.startsWith("/") ? path : `/${path}`;
  }

  private addRoute(path: string, handler: PtHandler, method: PtRouteMethod) {
    const formattedUrl = this.basePath + path.replace(/\/$/, "");
    let routes = this.routesByUrl[formattedUrl];

    if (routes == null) {
      routes = [];
      this.routesByUrl[formattedUrl] = routes;
    }

    routes.push({
      method: method.toUpperCase(),
      handler,
    });
  }
}
