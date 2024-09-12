import { TokenModel } from './../models/backend/tokens.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { environment } from '../../../environments/environment';
import { SigninModel } from '../models/backend/signin.model';
import { TokensModel } from '../models/backend/tokens.model';
import { SignupModel } from '../models/backend/signup.model';
import {
  DOMAIN_AUTH,
  METHOD_SIGNIN,
  METHOD_SIGNUP,
  METHOD_REFRESH_TOKEN,
} from '../consts';
import { MessageModel } from '../models/backend/message.model';
import {
  ActivationModel,
  ResetPasswordModel,
} from '../models/backend/reset_password.model';

const AUTH_URL = `${environment.BACKEND_URL}/${DOMAIN_AUTH}`;
const KEY_ACCESS_TOKEN = 'access_token';
const KEY_REFRESH_TOKEN = 'refresh_token';
const KEY_TOKEN_TYPE = 'token_type';
const EXPIRES_ACCESS_TOKEN = 1;
const EXPIRES_REFRESH_TOKEN = 7;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  Signin(signinModel: SigninModel) {
    const formData = new FormData();
    formData.set('username', signinModel.username);
    formData.set('password', signinModel.password);

    return this.httpClient.post<TokensModel>(
      `${AUTH_URL}/${METHOD_SIGNIN}`,
      formData
    );
  }

  Signup(signupModel: SignupModel) {
    return this.httpClient.post<MessageModel>(
      `${AUTH_URL}/${METHOD_SIGNUP}`,
      signupModel
    );
  }

  IsLoggedIn() {
    return this.cookieService.GetCookie(KEY_REFRESH_TOKEN) != null;
  }

  RecoverPassword(email: any) {
    return this.httpClient.post<MessageModel>(`${AUTH_URL}/password/recover`, {
      email: email,
    });
  }

  ResetPassword(data: ResetPasswordModel) {
    return this.httpClient.post<MessageModel>(
      `${AUTH_URL}/password/reset`,
      data
    );
  }

  Activation(data: ActivationModel) {
    return this.httpClient.post<MessageModel>(`${AUTH_URL}/activation`, data);
  }

  RefreshToken() {
    return this.httpClient.get<TokensModel>(
      `${AUTH_URL}/${METHOD_REFRESH_TOKEN}`
    );
  }

  DeleteTokens() {
    this.cookieService.DeleteCookie(KEY_ACCESS_TOKEN);
    this.cookieService.DeleteCookie(KEY_REFRESH_TOKEN);
  }

  SaveTokens(pair: TokensModel) {
    this.cookieService.SetCookie({
      name: KEY_ACCESS_TOKEN,
      value: pair.access_token,
      expireDays: EXPIRES_ACCESS_TOKEN,
      secure: true,
    });
    this.cookieService.SetCookie({
      name: KEY_REFRESH_TOKEN,
      value: pair.refresh_token,
      expireDays: EXPIRES_REFRESH_TOKEN,
      secure: true,
    });
    this.cookieService.SetCookie({
      name: KEY_TOKEN_TYPE,
      value: pair.token_type,
      expireDays: EXPIRES_REFRESH_TOKEN,
      secure: true,
    });
  }

  GetAccessToken() {
    let token = this.cookieService.GetCookie(KEY_ACCESS_TOKEN);
    let token_type = this.cookieService.GetCookie(KEY_TOKEN_TYPE);
    return new TokenModel(token, token_type);
  }

  GetRefreshToken() {
    let token = this.cookieService.GetCookie(KEY_REFRESH_TOKEN);
    let token_type = this.cookieService.GetCookie(KEY_TOKEN_TYPE);
    return new TokenModel(token, token_type);
  }
}
