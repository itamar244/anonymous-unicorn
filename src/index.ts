import { PtServer } from "./pt-server/server";
import { PtRouter } from "./pt-server/router";

import { createUnicornsController } from "./api/unicorns.controller";
import { UnicornsService } from "./api/unicorns.service";
import { createMealsController } from "./api/meals.controller";
import { MealsService } from "./api/meals.service";
import { InMemoryDatabase } from "./db";

const database = new InMemoryDatabase();
const server = new PtServer();

const mealsService = new MealsService(database);
const router = new PtRouter("/api");
router.use(createUnicornsController(new UnicornsService(database, mealsService)));
router.use(createMealsController(mealsService));

server.use(router);

async function main() {
  await database.init();
  await server.listen(4000);
  console.log("server is running");
}

main().catch(console.error);
