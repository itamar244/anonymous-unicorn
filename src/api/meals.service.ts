import { IDatabaseCollection } from "../db";
import { Meal } from "./interfaces";
import { CreateMealInput } from "./meals.inputs";

export class MealsService {
  constructor(private db: IDatabaseCollection<Meal>) {}

  getMealsByUnicornId(id: string): Promise<Meal[]> {
    return this.db.find({ unicornId: id });
  }

  getAllMeals(): Promise<Meal[]> {
    return this.db.get();
  }

  async addMeal(meal: CreateMealInput) {
    await this.db.create(meal);
  }
}
