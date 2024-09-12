import { AGAIN_AUTH, SIGNIN_PROCCESS, EXIT, SIGN_WITHIN } from './../phrases';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FORM_AUTHORIZATION,
  BUTTON_FORGOT_PSWD,
  BUTTON_LOGIN,
  BUTTON_REGISTRATION,
} from '../phrases';
import { PATH_TO_IAMGES } from '../consts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showMessage } from '../../shared/functions';
import { ActivatedRoute, Params } from '@angular/router';
import { SigninModel } from '../../shared/models/backend/signin.model';
import { Store } from '@ngrx/store';
import { activation, signin } from '../../shared/store/sign/sign.actions';
import { LINK_PAGE_SIGNUP } from '../../shared/consts';
import {
  EmailFormFieldInput,
  PasswordFormFieldInput,
} from '../../shared/inputs';
import { ActivationModel } from '../../shared/models/backend/reset_password.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  code: string = '';
  title = FORM_AUTHORIZATION;
  nameButton = BUTTON_LOGIN;
  src_image = `${PATH_TO_IAMGES}login-image.svg`;
  sign_within = SIGN_WITHIN;

  links = [
    { name: BUTTON_REGISTRATION, link: LINK_PAGE_SIGNUP },
    { name: BUTTON_FORGOT_PSWD, link: '/auth/recovery' },
  ];

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  inputs = [
    new EmailFormFieldInput(this.form),
    new PasswordFormFieldInput(this.form),
  ];

  signin() {
    const { email, password } = this.form.value;

    if (email && password) {
      showMessage(this._snackBar, SIGNIN_PROCCESS);
      this.store.dispatch(
        signin({ credentials: new SigninModel(email, password) })
      );
    }
  }
  ngOnInit() {
    this.activateRoute.queryParams.subscribe((params) => {
      this.code = params['code'];
      if (this.code) {
        let data = new ActivationModel(this.code);
        this.store.dispatch(activation({ parametr: data }));
      }
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['authAgain']) {
        showMessage(this._snackBar, AGAIN_AUTH);
      } else if (params['logoutSuccess']) {
        showMessage(this._snackBar, EXIT);
      } else if (params['message']) {
        showMessage(this._snackBar, params['message']);
      } else if (params['accessDenied'])
        showMessage(this._snackBar, 'Авторизуйтесь чтобы попасть в систему');
      else if (params['deleteUser']) {
        showMessage(this._snackBar, 'Ваш аккаунт успешно удалён');
      }
    });
  }
}
