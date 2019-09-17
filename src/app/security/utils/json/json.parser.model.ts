export class JsonParserModel<T> {

  public fieldJson: string;
  public type: JsonParserType<T>;

  [key: string]: any;

  constructor(name: string, type: JsonParserType<T>) {
    this.fieldJson = name;
    this.type = type;
  }

  public get finalType(): any {
    if (this.isArray) {
      return (this.type as any)[0];
    }

    return this.type as JsonParserSingleType<T>;
  }

  public get isArray(): boolean {
    return this.type instanceof Array;
  }

  public creator(): T {
    return new this.finalType();
  }
}

export declare interface JsonParserModelList {
  [key: string]: any;
}

export declare type JsonParserType<T> = JsonParserSingleType<T> | [JsonParserSingleType<T>];

export declare interface JsonParserSingleType<T> {
  new(): T;
}
