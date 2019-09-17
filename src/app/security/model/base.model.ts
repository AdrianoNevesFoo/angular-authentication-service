export class IBaseModel {
  id: number;
  enabled: boolean;
  deleted_at: Date;
  deleted_by: string;
  created_at: Date;
  deleted: boolean;
  created_by: string;
  modified_at: Date;
  last_modified_by: string;

}

export class BaseModel implements IBaseModel {
  public id: number;
  public readonly enabled: boolean;
  public readonly deleted_at: Date;
  public readonly deleted_by: string;
  public readonly created_at: Date;
  public readonly deleted: boolean;
  public readonly created_by: string;
  public readonly modified_at: Date;
  public readonly last_modified_by: string;

  [key: string]: any;
}
