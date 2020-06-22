import { Item, IDatabase, IDatabaseCollection } from "./interfaces";

export class DatabaseCollection<TItem extends Item = Item> implements IDatabaseCollection<TItem> {
  constructor(private database: IDatabase<string, TItem>, private collectionName: string) {}

  get(): Promise<TItem[]> {
    return this.database.get(this.collectionName);
  }

  find(query: Partial<TItem>): Promise<TItem[]> {
    return this.database.find(this.collectionName, query);
  }

  findOneById(id: string): Promise<TItem | null> {
    return this.database.findOneById(this.collectionName, id);
  }

  create(value: TItem): Promise<void> {
    return this.database.create(this.collectionName, value);
  }

  update(id: string, update: Partial<TItem>): Promise<void> {
    return this.database.update(this.collectionName, id, update);
  }
}