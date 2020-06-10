import { IDatabase } from "../db";
import { Meal } from "./interfaces";

export class MealsService {
  constructor(private db: IDatabase<"meals", Meal>) {}

  getMealsByUnicornId(id: string): Promise<Meal[]> {
    return this.db.find("meals", { unicornId: id });
  }

  getAllMeals(): Promise<Meal[]> {
    return this.db.get("meals");
  }

  async addMeal(meal: Meal) {
    await this.db.create("meals", meal);
  }
}
