import { IDatabaseCollection } from "../db";
import { Unicorn, ResolvedUnicorn } from "./interfaces";
import { MealsService } from "./meals.service";

export class UnicornsService {
  constructor(private db: IDatabaseCollection<Unicorn>, private mealsService: MealsService) {}

  async getUnicornById(id: string): Promise<ResolvedUnicorn | null> {
    const unicorn = await this.db.findOneById(id);

    if (unicorn !== null) {
      return {
        ...unicorn,
        meals: await this.mealsService.getMealsByUnicornId(id),
      };
    }

    return null;
  }

  getAllUnicorns(): Promise<Unicorn[]> {
    return this.db.get();
  }

  async createUnicorn(unicorn: Unicorn) {
    await this.db.create(unicorn);
  }

  async updateUnicorn(id: string, update: Partial<Unicorn>) {
    await this.db.update(id, update);
  }
}
