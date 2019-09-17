import { EventEmitter, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenModel } from './model/token.model';

export class TokenStoreService {

  public invalidTokenRequired = new EventEmitter<boolean>();
  private OAUTH_TOKEN = 'OAUTH_TOKEN';

  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private jwtHelperService = new JwtHelperService();

  public setToken(token: any): void {
    const tokenInfo: TokenModel = new TokenModel(token);
    localStorage.setItem(this.ACCESS_TOKEN, tokenInfo.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokenInfo.refreshToken);
  }

  public getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  public getToken(): TokenModel {

    const jsonToken = JSON.parse(localStorage.getItem(this.OAUTH_TOKEN));
    if (jsonToken) {
      const tokenInfo: TokenModel = Object.assign(new TokenModel(), jsonToken);

      if (!tokenInfo.isExpired()) {
        return tokenInfo;
      }
    }

    this.invalidTokenRequired.emit(true);
    return new TokenModel(null);
  }

  public clearToken() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(this.OAUTH_TOKEN);
      localStorage.removeItem(this.ACCESS_TOKEN);
      localStorage.removeItem(this.REFRESH_TOKEN);
      resolve();
    });
  }

  public getTokenDecode(): any {
    return this.jwtHelperService.decodeToken(localStorage.getItem(this.ACCESS_TOKEN));
  }

  public isTokenExpired(): boolean {
    return this.jwtHelperService.isTokenExpired(localStorage.getItem(this.ACCESS_TOKEN));

  }

}
