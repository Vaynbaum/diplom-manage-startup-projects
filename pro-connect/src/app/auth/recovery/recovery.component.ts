import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORM_FORGOT_PSWD, BUTTON_LOGIN, BUTTON_RECOVERY } from '../phrases';
import { PATH_TO_IAMGES } from '../consts';
import { LINK_PAGE_SIGNIN } from '../../shared/consts';
import { EmailFormFieldInput } from '../../shared/inputs';
import { Store } from '@ngrx/store';
import { recoveryPassword } from '../../shared/store/sign/sign.actions';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit {
  title = FORM_FORGOT_PSWD;
  nameButton = BUTTON_RECOVERY;
  src_image = `${PATH_TO_IAMGES}forgot-password-image.svg`;

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  inputs = [new EmailFormFieldInput(this.form)];

  link = { name: BUTTON_LOGIN, link: LINK_PAGE_SIGNIN };

  constructor(private store: Store) {}

  ngOnInit() {}

  reset() {
    const { email } = this.form.value;
    if (email) {
      this.store.dispatch(recoveryPassword({ email: email }));
    }
  }
}
