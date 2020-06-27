import { PtRouter, PtError, getBody } from "../pt-server";

import { UnicornsService } from "./unicorns.service";
import { CreateUnicornInput } from "./unicorns.inputs";
import { Unicorn } from "./interfaces";

export function createUnicornsController(service: UnicornsService) {
  const router = new PtRouter("/unicorns");

  router.get("/", async (req) => {
    if (typeof req.query.id === "string") {
      const id = req.query.id;
      return await getUnicorn(id);
    }

    return service.getAllUnicorns();
  });

  router.post("/", async (req) => {
    const body = await getBody(CreateUnicornInput, req);
    await service.createUnicorn(body);
  });

  router.put("/", async (req) => {
    const id = req.query.id as string;
    const body = await getBody(CreateUnicornInput, req, { allowMissingProperties: true });
    await getUnicorn(id);
    await service.updateUnicorn(id, req.body as Partial<Unicorn>);
  });

  return router;

  async function getUnicorn(id: string) {
    const unicorn = await service.getUnicornById(id);

    if (unicorn === null) {
      throw new PtError(404, "unicorn with given id not found", { id });
    }

    return unicorn;
  }
}
