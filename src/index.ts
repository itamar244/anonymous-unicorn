import { PtServer } from "./pt-server/server";
import { PtRouter } from "./pt-server/router";

const server = new PtServer();
const router = new PtRouter("/api");

router.get("/hello", () => {
  return "Hello World!";
});

router.post("/request", (req) => {
  return {
    body: req.body,
    query: req.query,
  };
});

server.use(router);

async function main() {
  await server.listen(4000);
  console.log("server is running");
}

main().catch(console.error);
