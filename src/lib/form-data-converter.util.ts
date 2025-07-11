type RecordConverted = Record<string, string | symbol | object | number | boolean | bigint | undefined | null>;

export default class FormDataConverter {
  private static OBJECT_SYMBOL = "{}";
  private static BOOLEAN_SYMBOL = "{b}";
  private static NUMBER_SYMBOL = "{n}";

  private static TRUE_VALUE = "true";

  public static toRecord(formData: FormData): RecordConverted {
    const uniqueKeys = new Set<string>(formData.keys());

    let result: RecordConverted = {};

    uniqueKeys.forEach((key) => {
      if (key.endsWith(this.OBJECT_SYMBOL))
        return (result = { ...result, [this.removeSymbol(key)]: JSON.stringify(formData.get(key)) });

      if (key.endsWith(this.BOOLEAN_SYMBOL))
        return (result = { ...result, [this.removeSymbol(key)]: formData.get(key) === this.TRUE_VALUE });

      if (key.endsWith(this.NUMBER_SYMBOL))
        return (result = { ...result, [this.removeSymbol(key)]: Number(formData.get(key)) });

      return (result = { ...result, [key]: formData.get(key) });
    });

    return result;
  }

  private static removeSymbol(key: string) {
    return key.replace(this.OBJECT_SYMBOL, "").replace(this.BOOLEAN_SYMBOL, "").replace(this.NUMBER_SYMBOL, "");
  }

  public static from<T extends RecordConverted>(record: RecordConverted | T): FormData {
    const keys = Object.keys(record);

    const formData = new FormData();

    keys.forEach((key) => {
      const value = record[key];

      switch (typeof value) {
        case "string":
          formData.append(key, value);
          break;
        case "symbol":
          formData.append(key, value.toString());
          break;
        case "object":
          formData.append(key + this.OBJECT_SYMBOL, JSON.stringify(value));
          break;
        case "number":
          formData.append(key + this.NUMBER_SYMBOL, value.toString());
          break;
        case "boolean":
          formData.append(key + this.BOOLEAN_SYMBOL, value.toString());
          break;
        case "bigint":
          formData.append(key + this.NUMBER_SYMBOL, value.toString());
          break;
        case "undefined":
          break;
        case "function":
          break;
      }
    });

    return formData;
  }
}
