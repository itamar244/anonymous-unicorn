import { IDatabase } from "../db";
import { Unicorn } from "./interfaces";

export class UnicornsService {
  constructor(private db: IDatabase<"unicorns", Unicorn>) {}

  getUnicornById(id: string): Promise<Unicorn | null> {
    return this.db.findOneById("unicorns", id);
  }

  getAllUnicorns(): Promise<Unicorn[]> {
    return this.db.get("unicorns");
  }

  async createUnicorn(unicorn: Unicorn) {
    await this.db.create("unicorns", unicorn);
  }

  async updateUnicorn(id: string, update: Partial<Unicorn>) {
    await this.db.update("unicorns", id, update);
  }
}
