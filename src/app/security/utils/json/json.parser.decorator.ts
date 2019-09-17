import {JsonParserDeserializable} from './json.parser.deserializable';
import {JsonParserType} from './json.parser.model';
import { BaseModel } from '../../model/base.model';

export function JsonParser<T>(type: JsonParserType<T>): any;
export function JsonParser<T extends BaseModel>(type: JsonParserType<T>): any {
  return (target: any, key: string) => {
    JsonParserDeserializable.registerField<T>(target.constructor.name, key, type);
  };
}
