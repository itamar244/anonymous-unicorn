import { PtRouter } from "../pt-server/router";
import { MealsService } from "./meals.service";
import { Meal } from "./interfaces";

export function createMealsController(service: MealsService) {
  const router = new PtRouter("/meals");

  router.get("/", (req) => {
    if (typeof req.query.unicornId === "string") {
      return service.getMealsByUnicornId(req.query.unicornId);
    }

    return service.getAllMeals();
  });

  router.post("/", async (req) => {
    await service.addMeal(req.body as Meal);
  });

  return router;
}
