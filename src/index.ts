import { PtServer } from "./pt-server/server";
import { PtRouter } from "./pt-server/router";
import { createUnicornsController } from "./api/unicorns.controller";
import { UnicornsService } from "./api/unicorns.service";
import { createMealsController } from "./api/meals.controller";
import { MealsService } from "./api/meals.service";

const server = new PtServer();
const router = new PtRouter("/api");

router.use(createUnicornsController(new UnicornsService()));
server.use(router);
router.use(createMealsController(new MealsService()));
server.use(router);

async function main() {
  await server.listen(4000);
  console.log("server is running");
}

main().catch(console.error);
