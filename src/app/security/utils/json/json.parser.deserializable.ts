import {JsonParserModel, JsonParserModelList, JsonParserType} from './json.parser.model';
import { BaseModel } from '../../model/base.model';


export class JsonParserDeserializable {
  private static serializable: JsonParserModelList = {};
  public static registerField<T extends BaseModel>(model: string, name: string, type: JsonParserType<T>) {

    if (!JsonParserDeserializable.serializable[model]) {
      JsonParserDeserializable.serializable[model] = [];
    }

    JsonParserDeserializable.serializable[model].push(
      new JsonParserModel(name, type)
    );
  }

  public static deserialize<T>(type: { new(): any } | any, _result: T): any {
    const serializerInfo: JsonParserModel<T> = JsonParserDeserializable.serializable[type.name];
    const result: BaseModel = Object.assign(new type(), _result) as BaseModel;

    if (serializerInfo && serializerInfo.length) {
      serializerInfo.forEach((prop: JsonParserModel<T>) => {
        if (result[prop.fieldJson]) {

          if (prop.isArray) {
            result[prop.fieldJson] = result[prop.fieldJson].map((item: any) => {
              return JsonParserDeserializable.deserialize(prop.finalType, item);
            });
          } else {
            result[prop.fieldJson] = JsonParserDeserializable.deserialize(prop.finalType, result[prop.fieldJson]);
          }
        }
      });
    }

    return result;
  }



}
