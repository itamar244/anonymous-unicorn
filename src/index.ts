import "reflect-metadata";
import Container from "typedi";
import { PtServer, PtRouter } from "./pt-server";

import { InMemoryDatabase, registerDatabase } from "./db";
import { createUnicornsController } from "./api/unicorns.controller";
import { createMealsController } from "./api/meals.controller";
import { UnicornsService } from "./api/unicorns.service";
import { MealsService } from "./api/meals.service";

const container = Container.of("app");
const database = new InMemoryDatabase();
const server = new PtServer();

registerDatabase(container, database);

const router = new PtRouter("/api");
router.use(createUnicornsController(container.get(UnicornsService)));
router.use(createMealsController(container.get(MealsService)));

server.use(router);

async function main() {
  await database.init();
  await server.listen(4000);
  console.log("server is running");
}

main().catch(console.error);
