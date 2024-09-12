import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokensInterceptor } from './tokens.interceptor';
import { Provider } from '@angular/core';

export const httpInterceptorProviders: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokensInterceptor,
  multi: true,
};
