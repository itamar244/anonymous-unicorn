import * as url from "url";
import * as querystring from "querystring";
import { createServer, Server, IncomingMessage, ServerResponse } from "http";

import { PtRouter, PtRoute } from "./router";
import { logTime } from "./decorators";
import { PtError } from "./errors";

export class PtServer extends PtRouter {
  private server?: Server;

  async listen(port: number) {
    await this.unlisten();

    const server = createServer((req, res) => {
      this.listener(req, res);
    });
    this.server = server;

    return new Promise((resolve) => {
      server.listen(port, () => {
        resolve();
      });
    });
  }

  unlisten() {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }
      
      this.server?.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @logTime
  private async listener(req: IncomingMessage, res: ServerResponse) {
    const body = await this.getBody(req);
    const requestUrl = url.parse(req.url!);

    console.log("requested", req.url, req.method);

    const routes = this.getRoutes(requestUrl.pathname!, req.method!);

    try {
      await this.handleRoutes(routes, body, requestUrl.query, res);
    } catch (error) {
      this.handleError(error, res);
    }

    res.end();
  }

  private async handleRoutes(
    routes: PtRoute[],
    body: any,
    query: string | null,
    res: ServerResponse
  ) {
    if (routes.length === 0) {
      throw new PtError(404, "Not Found");
    }
    if (routes.length > 1) {
      throw new PtError(500, "Found more than one matching route");
    }

    const { handler } = routes[0];
    const response = await handler({
      body,
      query: querystring.parse(query ?? ""),
    });

    if (response !== undefined) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(response));
    }
  }

  private handleError(error: PtError | any, res: ServerResponse) {
    const statusCode = error.statusCode ?? 500;
    const response = {
      message: error.message ?? "Exception was thrown in the server",
      meta: error.meta ?? {},
      stack: error.stack,
      statusCode: statusCode,
    };

    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.write(JSON.stringify(response));
  }

  private async getBody(req: IncomingMessage) {
    let data = "";

    for await (const chunk of req) {
      data += chunk;
    }

    return req.headers["content-type"] === "application/json" ? JSON.parse(data) : data;
  }
}
