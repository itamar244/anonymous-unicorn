import { Item } from "../db";

export interface Unicorn extends Item {
  name: string;
  color: string;
  // in cm
  hornLength: number;
}

export interface Meal extends Item {
  unicornId: string;
  // in g
  weight: number;
  type: string;
  date: Date;
}