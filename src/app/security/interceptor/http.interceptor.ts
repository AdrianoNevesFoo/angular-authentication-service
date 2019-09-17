import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Router} from '@angular/router';
import { TokenStoreService } from '../token.store.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class IdHttpInterceptor implements HttpInterceptor {

  constructor(protected tokenStoreService: TokenStoreService,
              protected  authService: AuthService,
              protected router: Router) {

  }

  // TODO: colocar alertar de sessão expirada
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.tokenStoreService.getAccessToken() && this.tokenStoreService.isTokenExpired()) {
      // this.uiService.idAlertService.showBasicAlertWarning('Ops!', 'Sessão expirada, efetue login novamente.').subscribe(() => {
        // this.authService.logout();
      // });
      this.authService.logout();
      return Observable.throwError('unauthorized');
    }

    return next.handle(request)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          // handle responses
        }
      }).catch(response => {
        if (response instanceof HttpErrorResponse) {
          // handle errors (devops)
        }

        return Observable.throwError(response);
      });
  }
}
