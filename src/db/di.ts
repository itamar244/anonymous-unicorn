import { Container, Token, ContainerInstance } from "typedi";
import { IDatabase } from "./interfaces";

export const DATABASE_TOKEN = new Token("database");

export function registerDatabase(container: ContainerInstance, db: IDatabase) {
  container.set(DATABASE_TOKEN, db);
}

export function InjectCollection(collectionName: string) {
  return function (object: Object, propertyName: string, index?: number) {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (containerInstance) =>
        containerInstance.get<IDatabase>(DATABASE_TOKEN).collection(collectionName),
    });
  };
}
