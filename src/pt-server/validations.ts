import { PtRequest } from "./router";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { PtError } from "./errors";

export interface GetBodyOptions {
  allowMissingProperties?: boolean;
}

export async function getBody<T extends object>(
  objectClass: { new (): T },
  req: PtRequest,
  options: GetBodyOptions = {}
) {
  const body = plainToClass(objectClass, req.body);

  if (process.env.NODE_ENV !== "production") {
    const validationErrors = await validate(body, {
      skipMissingProperties: options.allowMissingProperties ?? false,
    });

    if (validationErrors.length > 0) {
      throw new PtError(400, "request was badly formatted", { errors: validationErrors });
    }
  }

  return body;
}
