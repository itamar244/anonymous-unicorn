import {PtServer} from "./server";

const server = new PtServer();

server.get('/hello', () => {
  return "Hello World!";
});

server.post('/request', (req) => {
  return {
    body: req.body,
    query: req.query,
  };
});

server.listen(4000);