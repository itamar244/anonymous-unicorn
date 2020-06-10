import * as url from 'url';
import * as querystring from 'querystring';
import {createServer, Server, IncomingMessage} from 'http';

import { PtRouter, PtHandler } from './router';

export class PtServer {
  private rootRouter = new PtRouter();
  server?: Server;

  get(url: string, handler: PtHandler) {
    this.rootRouter.get(url, handler);
  }

  post(url: string, handler: PtHandler) {
    this.rootRouter.post(url, handler);
  }

  put(url: string, handler: PtHandler) {
    this.rootRouter.put(url, handler);
  }

  delete(url: string, handler: PtHandler) {
    this.rootRouter.delete(url, handler);
  }

  async listen(port: number) {
    await this.unlisten();

    this.server = createServer(async (req, res) => {
      const body = await this.getBody(req);
      const requestUrl = url.parse(req.url!);

      console.log('requested', req.url, req.method, req.headers['content-type']);
      
      const routes = this.rootRouter.getRoutes(req.url!, req.method!);
      let response;
      
      if (routes.length === 0) {
        res.writeHead(404);
        res.end();
        return;
      }

      for (const { handler } of routes) {
        const handlerResponse = await handler({
          body,
          query: querystring.parse(requestUrl.query ?? ''),
        });

        if (response === undefined) {
          response = handlerResponse;
        }
      }

      if (response !== undefined) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(response));
      }

      res.end();
    });
    
    this.server.listen(port);
  }

  private async getBody(req: IncomingMessage) {
    if (req.method === 'POST') {

    }
    
    let data = "";

    for await (const chunk of req) {
      data += chunk;
    }

    return req.headers['content-type'] === 'application/json' ? JSON.parse(data) : data;
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
    })
  }
}
