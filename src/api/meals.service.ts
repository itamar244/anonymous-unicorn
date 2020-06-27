import { Service } from "typedi";

import { IDatabaseCollection, InjectCollection } from "../db";
import { Meal } from "./interfaces";
import { CreateMealInput } from "./meals.inputs";

@Service()
export class MealsService {
  constructor(
    @InjectCollection("meals")
    private db: IDatabaseCollection<Meal>
  ) {}

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
