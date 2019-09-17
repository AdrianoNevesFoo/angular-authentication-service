import { BaseHttpService } from '../service/base.http.service';
import {environment} from '../../../environments/environment';
export function IdRestClass(base: string, endpoint: string = 'api', resolveHeaders?: () => {}) {

  if (!base) {
    throw new Error('@IdRestClass precisa do parâmetro [base] definido.');
  }

  return (target: any) => {
    const endpointUrl = (): string => {

      if (!endpoint || !environment[endpoint]) {
        throw new Error(`@IdClassRest endpoint [${endpoint}] não definido/encontrado.`);
      }

      return BaseHttpService.clearRouteFragment(environment[endpoint]);
    };

    target.prototype.resolveHeaders = resolveHeaders;

    target.prototype.baseUrl = () => {
      return `${endpointUrl()}/${BaseHttpService.clearRouteFragment(base)}`;
    };

    return target;
  };
}
