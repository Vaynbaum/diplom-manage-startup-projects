import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  BUTTON_LOGIN,
  BUTTON_REGISTRATION,
  FORM_REGISTRATION,
  L_ENTER_PSWD_AGAIN,
  P_ENTER_PSWD_AGAIN,
  SIGNUP_PROCCESS,
  SIGN_WITHIN,
} from '../phrases';
import { PATH_TO_IAMGES, PSWD2 } from '../consts';
import { SignupModel } from '../../shared/models/backend/signup.model';
import {
  createPasswordNotMatchValidator,
  showMessage,
} from '../../shared/functions';
import { Store } from '@ngrx/store';
import { signup } from '../../shared/store/sign/sign.actions';
import { LINK_PAGE_SIGNIN } from '../../shared/consts';
import {
  EmailFormFieldInput,
  FirstnameFormFieldInput,
  LastnameFormFieldInput,
  PasswordFormFieldInput,
} from '../../shared/inputs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  title = FORM_REGISTRATION;
  nameButton = BUTTON_REGISTRATION;
  src_image = `${PATH_TO_IAMGES}registration-image.svg`;
  sign_within = SIGN_WITHIN;

  form = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      password2: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
    },
    createPasswordNotMatchValidator()
  );

  inputs = [
    new LastnameFormFieldInput(this.form),
    new FirstnameFormFieldInput(this.form),
    new EmailFormFieldInput(this.form),
    new PasswordFormFieldInput(this.form),
    new PasswordFormFieldInput(
      this.form,
      L_ENTER_PSWD_AGAIN,
      P_ENTER_PSWD_AGAIN,
      PSWD2
    ),
  ];

  link = { name: BUTTON_LOGIN, link: LINK_PAGE_SIGNIN };

  constructor(private store: Store, private _snackBar: MatSnackBar) {}
  ngOnInit() {}

  signup() {
    const { firstname, lastname, email, password } = this.form.value;

    if (firstname && lastname && password && email) {
      const user = new SignupModel(firstname, lastname, password, email);
      showMessage(this._snackBar, SIGNUP_PROCCESS);
      this.store.dispatch(signup({ user: user }));
    }
  }
}
