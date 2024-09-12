import { resetPassword } from './../../shared/store/sign/sign.actions';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PATH_TO_IAMGES, PSWD2 } from '../consts';
import { PasswordFormFieldInput } from '../../shared/inputs';
import { ResetPasswordModel } from '../../shared/models/backend/reset_password.model';
import { Store } from '@ngrx/store';
import { createPasswordNotMatchValidator } from '../../shared/functions';
import { BUTTON_LOGIN, L_ENTER_PSWD_AGAIN, P_ENTER_PSWD_AGAIN } from '../phrases';
import { LINK_PAGE_SIGNIN } from '../../shared/consts';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  src_image = `${PATH_TO_IAMGES}reset-image.svg`;
  title = 'Смена пароля';
  code: string = '';
  link = { name: BUTTON_LOGIN, link: LINK_PAGE_SIGNIN };

  form = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password2: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    createPasswordNotMatchValidator()
  );

  inputs = [
    new PasswordFormFieldInput(this.form),
    new PasswordFormFieldInput(
      this.form,
      L_ENTER_PSWD_AGAIN,
      P_ENTER_PSWD_AGAIN,
      PSWD2
    ),
  ];
  nameButton = 'Сменить пароль';

  constructor(private activateRoute: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((params) => {
      this.code = params['code'];
    });
  }

  reset() {
    const { password } = this.form.value;
    if (password) {
      let data = new ResetPasswordModel(this.code, password);
      this.store.dispatch(resetPassword({ parametr: data }));
    }
  }
}
