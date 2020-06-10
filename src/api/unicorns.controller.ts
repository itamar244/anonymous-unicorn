import { PtRouter } from "../pt-server/router";
import { UnicornsService } from "./unicorns.service";
import { Unicorn } from "./interfaces";
import { PtError } from "../pt-server/errors";

export function createUnicornsController(service: UnicornsService) {
  const router = new PtRouter("/unicorns");

  router.get("/", async (req) => {
    if (typeof req.query.id === "string") {
      const unicorn = await service.getUnicornById(req.query.id);

      if (unicorn === null) {
        throw new PtError(404, "unicorn with given not found", { id: req.query.id });
      }

      return unicorn;
    }

    return service.getAllUnicorns();
  });

  router.post("/", async (req) => {
    await service.createUnicorn(req.body as Unicorn);
  });

  router.put("/", async (req) => {
    await service.updateUnicorn(req.query.id as string, req.body as Partial<Unicorn>);
  });

  return router;
}
