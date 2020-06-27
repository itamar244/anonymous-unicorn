import { PtRouter, getBody } from "../pt-server";

import { MealsService } from "./meals.service";
import { CreateMealInput } from "./meals.inputs";

export function createMealsController(service: MealsService) {
  const router = new PtRouter("/meals");

  router.get("/", (req) => {
    if (typeof req.query.unicornId === "string") {
      return service.getMealsByUnicornId(req.query.unicornId);
    }

    return service.getAllMeals();
  });

  router.post("/", async (req) => {
    const body = await getBody(CreateMealInput, req);
    await service.addMeal(body);
  });

  return router;
}
