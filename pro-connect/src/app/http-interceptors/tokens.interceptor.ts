import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { TokenModel } from '../shared/models/backend/tokens.model';
import { DOMAIN_AUTH, METHOD_REFRESH_TOKEN } from '../shared/consts';
import { HEADER_NAME_AUTHORIZATION } from './const';

@Injectable()
export class TokensInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  setHeader(req: HttpRequest<any>, token: TokenModel) {
    if (token.token) {
      req = req.clone({
        headers: req.headers.set(
          HEADER_NAME_AUTHORIZATION,
          `${token.token_type} ${token.token}`
        ),
      });
    }
    return req;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token: TokenModel | null = null;
    let is_ref = req.url.includes(`/${DOMAIN_AUTH}/${METHOD_REFRESH_TOKEN}`);

    if (is_ref) token = this.authService.GetRefreshToken();
    else token = this.authService.GetAccessToken();

    req = this.setHeader(req, token);
    return next.handle(req);
  }
}
