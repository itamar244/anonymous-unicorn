import * as fs from "fs";

export interface Item {
  _id: string;
}

export interface IDatabase<TCollectionName extends string = string, TItem extends Item = Item> {
  init(): Promise<void>;
  get(collectionName: TCollectionName): Promise<TItem[]>;
  find(collectionName: TCollectionName, query: Partial<TItem>): Promise<TItem[]>;
  findOneById(collectionName: TCollectionName, id: string): Promise<TItem | null>;
  create(collectionName: TCollectionName, value: TItem): Promise<void>;
  update(collectionName: TCollectionName, id: string, update: Partial<TItem>): Promise<void>;
}

export class InMemoryDatabase implements IDatabase<string, any> {
  private collections = new Map<string, any[]>();
  private itemId = 0;

  async init() {
    try {
      const dump = JSON.parse((await fs.promises.readFile("./.dump")).toString());
      this.collections = new Map(Object.entries(dump));
    } catch {}
  }

  async get(collectionName: string): Promise<any[]> {
    let value = this.collections.get(collectionName);

    if (value == null) {
      value = [];
      this.collections.set(collectionName, value);
    }

    return value;
  }

  async find(collectionName: string, query: Partial<any>): Promise<any[]> {
    return (await this.get(collectionName)).filter((item) =>
      Object.keys(query).every((key) => item[key] === query[key])
    );
  }

  async findOneById(collectionName: string, id: string): Promise<any | null> {
    return (await this.get(collectionName)).find((item) => item._id === id) ?? null;
  }

  async create(collectionName: string, value: object): Promise<void> {
    const collection = await this.get(collectionName);
    collection.push({ ...value, _id: (this.itemId++).toString() });
    await this.dumpData();
  }

  async update(collectionName: string, id: string, update: any): Promise<void> {
    const item = await this.findOneById(collectionName, id);

    if (item != null) {
      Object.assign(item, update, { _id: id });
    }
  }

  async dumpData() {
    const object: Record<string, any[]> = {};
    for (const [key, value] of this.collections.entries()) {
      object[key] = value;
    }
    await fs.promises.writeFile("./.dump", JSON.stringify(object));
  }
}
