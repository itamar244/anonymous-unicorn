import { IsString, IsPositive } from "class-validator";
import { Unicorn } from "./interfaces";

export class CreateUnicornInput implements Partial<Unicorn> {
  @IsString()
  name!: string;
  @IsString()
  color!: string;
  // in cm
  @IsPositive()
  hornLength!: number;
}