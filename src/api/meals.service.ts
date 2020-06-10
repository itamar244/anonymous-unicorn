import { Meal } from "./interfaces";

export class MealsService {
  private meals: Meal[] = [];
  private currentId = 0;

  getMealsByUnicornId(id: string): Meal[] {
    return this.meals.filter((meal) => meal.unicornId === id);
  }

  getAllMeals(): Meal[] {
    return this.meals;
  }

  addMeal(meal: Meal) {
    this.meals.push({
      ...meal,
      id: (this.currentId++).toString(),
    });
  }
}
