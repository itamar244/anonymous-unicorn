import * as fs from "fs";

import { Item, IDatabaseCollection, IDatabase } from "./interfaces";
import { DatabaseCollection } from "./basic-collection";

export class InMemoryDatabase implements IDatabase<string, Item> {
  private collections = new Map<string, Item[]>();
  private collectionMappings = new Map<string, string>();
  private itemId = 0;
  private dumpQueued: boolean = false;

  async init() {
    try {
      const dump = JSON.parse((await fs.promises.readFile("./.dump")).toString());
      const entries: [string, Item[]][] = Object.entries(dump);
      this.collections = new Map(entries);
      const dumpMaxId = Math.max(
        ...entries.map(([_key, items]) => Math.max(...items.map((item) => +item._id)))
      );
      this.itemId = dumpMaxId + 1;
    } catch {}
  }

  collection<TCollectionItem extends Item>(
    collectionName: string
  ): IDatabaseCollection<TCollectionItem> {
    return new DatabaseCollection<Item>(this, collectionName) as any;
  }

  addCollectionMapping(originalCollectionName: string, mappedTo: string): void {
    this.collectionMappings.set(originalCollectionName, mappedTo);
  }

  async get(collectionName: string): Promise<Item[]> {
    const mappedCollectionName = this.collectionMappings.get(collectionName) ?? collectionName;
    let value = this.collections.get(mappedCollectionName);

    if (value == null) {
      value = [];
      this.collections.set(mappedCollectionName, value);
    }

    return value;
  }

  async find(collectionName: string, query: Partial<Item>): Promise<Item[]> {
    return (await this.get(collectionName)).filter((item) =>
      Object.keys(query).every((key) => (item as any)[key] === (query as any)[key])
    );
  }

  async findOneById(collectionName: string, id: string): Promise<Item | null> {
    return (await this.get(collectionName)).find((item) => item._id === id) ?? null;
  }

  async create(collectionName: string, value: object): Promise<void> {
    const collection = await this.get(collectionName);
    collection.push({ ...value, _id: (this.itemId++).toString() });
    this.queueDataDump();
  }

  async update(collectionName: string, id: string, update: Item): Promise<void> {
    const item = await this.findOneById(collectionName, id);

    if (item != null) {
      Object.assign(item, update, { _id: id });
    }

    this.queueDataDump();
  }

  queueDataDump() {
    if (this.dumpQueued) {
      return;
    }

    this.dumpQueued = true;
    setTimeout(async () => {
      const object: Record<string, Item[]> = {};
      for (const [key, value] of this.collections.entries()) {
        object[key] = value;
      }
      await fs.promises.writeFile("./.dump", JSON.stringify(object));
      this.dumpQueued = false;
    }, 2000);
  }
}
