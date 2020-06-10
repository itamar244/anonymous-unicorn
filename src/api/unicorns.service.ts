import { Unicorn } from "./interfaces";

export class UnicornsService {
  private unicorns: Unicorn[] = [];
  private currentId = 0;

  getUnicornById(id: string): Unicorn | null {
    return this.unicorns.find((unicorn) => unicorn.id === id) ?? null;
  }

  getAllUnicorns(): Unicorn[] {
    return this.unicorns;
  }

  createUnicorn(unicorn: Unicorn) {
    this.unicorns.push({
      ...unicorn,
      id: (this.currentId++).toString(),
    });
  }

  updateUnicorn(id: string, update: Partial<Unicorn>) {
    const unicorn = this.getUnicornById(id);
    Object.assign(unicorn, update, {id});
  }
}
