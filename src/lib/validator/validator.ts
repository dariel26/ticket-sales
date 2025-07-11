import { ApiError } from "next/dist/server/api-utils";
import { ZodSchema } from "zod";

export default class Validator<T> {
  private schema: ZodSchema<T>;

  constructor(schema: ZodSchema<T>) {
    this.schema = schema;
  }

  public async extractData(_data: unknown): Promise<T> {
    const data = await this.schema.safeParseAsync(_data);
    if (data.error) throw new ApiError(400, data.error.message);

    return data.data;
  }
}
