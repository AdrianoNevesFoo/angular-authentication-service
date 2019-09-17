import {Injectable, Type} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { TokenStoreService } from '../token.store.service';
import { JsonParserDeserializable } from '../utils/json/json.parser.deserializable';

@Injectable()
export abstract class BaseHttpService {

  protected clearCache: boolean;

  private baseUrl: () => {};
  private resolveHeaders: () => {};
  private methodHeadersResolve: () => {};
  private methodRoute: string;
  private cacheRequest: boolean;
  private requireAuthIfExists: boolean;


  public static clearRouteFragment(route: string): string {
    route = route.replace(/\/$/g, '');
    route = route.replace(/^\//g, '');
    return route;
  }

  constructor(public http: HttpClient, public _tokenStoreService: TokenStoreService) {
  }

  private get options() {
    const _options: any = {
      headers: {
        'Authorization': `Bearer ${this._tokenStoreService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    };

    if (this.requireAuthIfExists && !this._tokenStoreService.getAccessToken()) {
      delete _options.headers['Authorization'];
    }

    if (this.resolveHeaders) {
      const _headers: any = this.resolveHeaders();

      Object.keys(_headers).forEach((key: string) => {
        _options.headers[key] = _headers[key];
      });
    }

    if (this.methodHeadersResolve) {
      const _headers: any = this.methodHeadersResolve();

      Object.keys(_headers).forEach((key: string) => {
        _options.headers[key] = _headers[key];
      });
    }

    _options.responseType = 'json';
    return _options;
  }

  protected get isAuthenticate(): boolean {
    return !!this.getToken();
  }

  protected getToken(decode?: boolean): string | any {
    return decode ? this._tokenStoreService.getTokenDecode() : this._tokenStoreService.getAccessToken();
  }

  protected get<T>(type: (new () => any) | any, params?: any, options?: object): Observable<T> {
    return this._get<T>(params, options).map((result: T) => {
      if (type instanceof Array && (type as any)[0].prototype.modelName) {
        return (result as any).map((item: any) => {
          return JsonParserDeserializable.deserialize((type as any)[0], item);
        });
      } else if (type.prototype && type.prototype.modelName) {
        return JsonParserDeserializable.deserialize<T>(type, result);
      }

      return result as T;
    });
  }

  protected post<T>(data: any, options?: object): Observable<T> {
    options = (options ? options : this.options);
    return this.http.post<T>(this.buildRoute().toString(), data, options);
  }

  protected put<T>(data: any, options?: object): Observable<T> {
    options = (options ? options : this.options);
    return this.http.put<T>(this.buildRoute().toString(), data, options);
  }

  protected delete<T>(params?: any, options?: object): Observable<T> {
    options = (options ? options : this.options);
    return this.http.delete<T>(this.buildRoute(params).toString(), options);
  }

  private _get<T>(params?: any, options?: object): Observable<T> {
    options = (options ? options : this.options);

    const originalRequest = this.http.get<T>(this.buildRoute(params).toString(), options);

    // implementar aqui a consulta por cache
    return originalRequest;
  }



  private buildRoute(params?: any): URL {
    const url: URL = new URL(`${BaseHttpService.clearRouteFragment(this.baseUrl().toString())}`);
    let _methodRoute: string = this.methodRoute;
    if (params) {
      Object.keys(params).forEach((key: string) => {
        if (_methodRoute.indexOf(`{${key}}`) > -1) {
          _methodRoute = _methodRoute.replace(`{${key}}`, params[key]);
        } else {
          if (params[key]) {
            url.searchParams.append(key, params[key]);
          }
        }
      });
    }

    url.pathname = BaseHttpService.clearRouteFragment(url.pathname)
      .concat(_methodRoute ? `/${BaseHttpService.clearRouteFragment(_methodRoute)}` : '');

    return new URL(url.toString());
  }

}
