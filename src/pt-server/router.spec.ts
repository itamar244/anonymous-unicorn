import { expect } from "chai";
import * as sinon from "sinon";

import { PtRouter as OriginalRouter, PtRoute, PtRouteMethod } from "./router";

class PtRouter extends OriginalRouter {
  getRoutes(nonFormattedPath: string, method: string): PtRoute[] {
    return super.getRoutes(nonFormattedPath, method);
  }
}

describe(PtRouter.name, () => {
  function expectToAddRoute(
    router: PtRouter,
    method: PtRouteMethod,
    path: string,
    routePath: string
  ) {
    const handler = sinon.spy();
    router[method](path, handler);

    expect(router.getRoutes(routePath, method.toUpperCase())).to.deep.equal([
      { method: method.toUpperCase(), handler },
    ] as PtRoute[]);
  }

  it("should create an empty router", () => {
    const router = new PtRouter();

    expect(router.getRoutes("/", "GET")).to.be.empty;
  });

  it("should resolve a simple route", () => {
    const router = new PtRouter("/api");

    expectToAddRoute(router, "get", "/", "/api");
    expectToAddRoute(router, "post", "/", "/api");
    expectToAddRoute(router, "put", "/", "/api");
    expectToAddRoute(router, "delete", "/", "/api");
  });

  it("should resolve a route with path", () => {
    const router = new PtRouter("/api");

    expectToAddRoute(router, "post", "/path", "/api/path");
  });

  it("should get nested route when nested routers", () => {
    const parentRouter = new PtRouter("/a");
    const router = new PtRouter("/b");
    const handler = sinon.spy();

    parentRouter.use(router);
    router.get('/c', handler);

    expect(parentRouter.getRoutes("/a/b/c", "GET")).to.deep.equal([
      { method: "GET", handler },
    ] as PtRoute[]);
  });
});
