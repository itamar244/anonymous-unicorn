export interface Item {
  _id: string;
}

export interface IDatabase<TCollectionName extends string = string, TItem extends Item = Item> {
  init(): Promise<void>;
  collection<TCollectionItem extends TItem>(
    collectionName: TCollectionName
  ): IDatabaseCollection<TCollectionItem>;
  addCollectionMapping(originalCollectionName: string, mappedTo: string): void;
  get(collectionName: TCollectionName): Promise<TItem[]>;
  find(collectionName: TCollectionName, query: Partial<TItem>): Promise<TItem[]>;
  findOneById(collectionName: TCollectionName, id: string): Promise<TItem | null>;
  create(collectionName: TCollectionName, value: TItem): Promise<void>;
  update(collectionName: TCollectionName, id: string, update: Partial<TItem>): Promise<void>;
}

export interface IDatabaseCollection<TItem extends Item = Item> {
  get(): Promise<TItem[]>;
  find(query: Partial<TItem>): Promise<TItem[]>;
  findOneById(id: string): Promise<TItem | null>;
  create(value: Omit<Item, "_id">): Promise<void>;
  update(id: string, update: Partial<TItem>): Promise<void>;
}
