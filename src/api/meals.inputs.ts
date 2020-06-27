import { IsString, IsNumber, IsPositive, IsDateString } from "class-validator";
import { Meal } from "./interfaces";

export class CreateMealInput implements Partial<Meal> {
  @IsString()
  unicornId!: string;
  @IsNumber()
  @IsPositive()
  weight!: number;
  @IsString()
  type!: string;
  @IsDateString()
  date!: Date;
}