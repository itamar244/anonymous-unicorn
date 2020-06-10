export interface Unicorn {
  id: string;
  name: string;
  color: string;
  // in cm
  hornLength: number;
}

export interface Meal {
  id: string;
  unicornId: string;
  // in g
  weight: number;
  type: string;
  date: Date;
}