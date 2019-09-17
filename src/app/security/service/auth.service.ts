import { Injectable} from '@angular/core';
import {Credentials} from '../model/credentials';
import {Observable} from 'rxjs/Observable';
import {UserModel} from '../model/user.model';
import {TokenModel} from '../model/token.model';
import { IdRestClass } from '../decorator/base.http.rest.class.decorator';
import { BaseHttpService } from './base.http.service';
import { TokenStoreService } from '../token.store.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestAuth } from '../decorator/base.http.auth.decorator';
import { IdRest } from '../decorator/base.http.rest.decorator';

/**
 * Serviço de autenticação oAuth2
 */
@Injectable()
@IdRestClass('/auth')
export class AuthService extends BaseHttpService {


  constructor(public http: HttpClient, private tokenStoreService: TokenStoreService,
              private router: Router) {
    super(http, tokenStoreService);

  }

  public getUserToken(clientId: string, password: string, credentials: Credentials): Observable<TokenModel> {
    const options = {
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${password}`),
        'Content-type': 'application/x-www-form-urlencoded'
      },
    };

    this.clearToken();

    return this.post<TokenModel>(this.getParams(credentials).toString(), options);
  }

  @IdRest('/signin')
  @RequestAuth(false)
  login(usernameOrEmail: string, password: string): Observable<TokenModel> {
    return this.post<any>({
      'usernameOrEmail': usernameOrEmail,
      'password': password
    });
  }

  public authenticate(clientId: string, password: string, credentials: Credentials): Observable<UserModel> {
    const options = {
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${password}`),
        'Content-type': 'application/x-www-form-urlencoded'
      },
    };

    this.clearToken();

    return this.post<TokenModel>(this.getParams(credentials).toString(), options)
      .pipe(token => {
        return this.setToken(token).pipe((token: any) => {

          return this.getCurrentUser();
        });
      });
  }


  public logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  public get isAuthenticate(): boolean {
    return !!this.getToken();
  }

  public getCurrentUser(): Observable<UserModel> {
    return null;
      //  return this.userService.getMeWithoutCache();
  }


  public getTokenInfo(): any {
    return this.getToken(true);
  }

  public checkRoles(roles: string[]): Observable<UserModel> {
    return this.getCurrentUser().map(user => {
      return user;
    });

  }

  public setToken(token: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.tokenStoreService.setToken(token);
      observer.next(token);
      observer.complete();
    });
  }


  private clearToken() {
    this.tokenStoreService.clearToken();
  }


  private getParams(credentials: Credentials): URLSearchParams {
    return this.convertCredentials(credentials);
  }

  private convertCredentials(clientCredentials: Credentials): URLSearchParams {
    const params = new URLSearchParams();
    params.set('username', clientCredentials.username);
    params.set('password', clientCredentials.password);
    params.set('grant_type', clientCredentials.grantType);
    return params;
  }
}
