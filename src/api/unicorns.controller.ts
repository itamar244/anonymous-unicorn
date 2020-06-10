import { PtRouter } from "../pt-server/router";
import { UnicornsService } from "./unicorns.service";
import { Unicorn } from "./interfaces";

export function createUnicornsController(service: UnicornsService) {
  const router = new PtRouter("/unicorns");

  router.get("/", (req) => {
    if (typeof req.query.id === "string") {
      return service.getUnicornById(req.query.id);
    }

    return service.getAllUnicorns();
  });

  router.post("/", (req) => {
    service.createUnicorn(req.body as Unicorn);
  });

  return router;
}
