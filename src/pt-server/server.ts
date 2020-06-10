import * as url from "url";
import * as querystring from "querystring";
import { createServer, Server, IncomingMessage, ServerResponse } from "http";

import { PtRouter } from "./router";
import { logTime } from "./decorators";

export class PtServer extends PtRouter {
  server?: Server;

  async listen(port: number) {
    await this.unlisten();
    
    this.server = createServer((req, res) => {
      this.listener(req, res);
    });
    
    this.server.listen(port);
  }

  unlisten() {
    if (!this.server) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
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

    const routes = this.getRoutes(req.url!, req.method!);
    let response;

    
    if (routes.length === 0) {
      res.writeHead(404);
      res.end();
      return;
    }
    
    for (const { handler } of routes) {
      const handlerResponse = await handler({
        body,
        query: querystring.parse(requestUrl.query ?? ""),
      });
      
      if (response === undefined) {
        response = handlerResponse;
      }
    }
    
    if (response !== undefined) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(response));
    }

    res.end();
  }

  private async getBody(req: IncomingMessage) {
    if (req.method === "POST") {
    }

    let data = "";

    for await (const chunk of req) {
      data += chunk;
    }

    return req.headers["content-type"] === "application/json" ? JSON.parse(data) : data;
  }
}
