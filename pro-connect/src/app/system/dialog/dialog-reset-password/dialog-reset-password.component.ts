import { Component, Inject, OnInit } from '@angular/core';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createPasswordNotMatchValidator } from '../../../shared/functions';
import { PasswordFormFieldInput } from '../../../shared/inputs';
import { L_ENTER_PSWD_AGAIN, P_ENTER_PSWD_AGAIN } from '../../../auth/phrases';
import { PSWD2 } from '../../../auth/consts';
import { MatDialogRef } from '@angular/material/dialog';
import {
  loadMyProfile,
  resetPassword,
} from '../../../shared/store/profile/profile.actions';
import { Store } from '@ngrx/store';
import { anySuccess } from '../../../shared/store/common.effects';

@Component({
  selector: 'app-dialog-reset-password',
  templateUrl: './dialog-reset-password.component.html',
  styleUrls: ['./dialog-reset-password.component.scss'],
})
export class DialogResetPasswordComponent implements OnInit {
  title = 'Смена пароля';
  saveBtn = { icon: SAVE_ICON, title: SAVE };
  form = new FormGroup(
    {
      password: new FormControl(null, [
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
  inps = [
    new PasswordFormFieldInput(this.form),
    new PasswordFormFieldInput(
      this.form,
      L_ENTER_PSWD_AGAIN,
      P_ENTER_PSWD_AGAIN,
      PSWD2
    ),
  ];
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogResetPasswordComponent>
  ) {}

  ngOnInit() {}

  save() {
    const { password } = this.form.value;
    if (password) {
      this.store.dispatch(resetPassword({ parametr: password }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.dialogRef.close();
        this.store.dispatch(loadMyProfile({}));
      });
    }
  }
}
