import { FormGroup } from '@angular/forms';
import { FormFieldInput } from '../shared/models/special/form-field-input';

import { BADGE, EMAIL, FNAME, LNAME, PSWD, TEXT } from '../shared/consts';
import {
  L_ENTER_EMAIL,
  L_ENTER_FNAME,
  L_ENTER_LNAME,
  L_ENTER_PSWD,
  P_EMPTY_EMAIL,
  P_EMPTY_PSWD,
  P_ENTER_EMAIL,
  P_ENTER_FNAME,
  P_ENTER_LNAME,
  P_ENTER_PSWD,
  P_INVALID_EMAIL,
  P_NOT_MATCH_PSWD,
  P_PSWD_BIGGER,
  P_PSWD_SYMB,
} from './phrases';

export class EmailFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_EMAIL,
    placeholder = P_ENTER_EMAIL
  ) {
    super(label, form.get?.(EMAIL), placeholder, EMAIL, EMAIL);
  }

  public override messageError(): any {
    let e = this.formControl?.['errors'];
    if (e?.['required']) return P_EMPTY_EMAIL;
    if (e?.[EMAIL]) return P_INVALID_EMAIL;
    return '';
  }
}

export class PasswordFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_PSWD,
    placeholder = P_ENTER_PSWD,
    key = PSWD
  ) {
    super(label, form.get?.(key), placeholder, 'key', undefined, true, true);
  }

  public override action_btn() {
    this.hide = !this.hide;
  }

  public override messageError(): any {
    let e = this.formControl?.['errors'];
    if (e?.['required']) return P_EMPTY_PSWD;

    let e_m = e?.['minlength'];
    if (e_m && e_m['requiredLength'])
      return `${P_PSWD_BIGGER} ${e_m['requiredLength']} ${P_PSWD_SYMB}`;
    if (e?.['passwordNotMatch']) return P_NOT_MATCH_PSWD;
    return '';
  }

  public override get type() {
    return this.hide ? PSWD : TEXT;
  }

  public override get icon() {
    return this.hide ? 'visibility_off' : 'visibility';
  }
}

export class FirstnameFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_FNAME,
    placeholder = P_ENTER_FNAME
  ) {
    super(label, form.get?.(FNAME), placeholder, BADGE, TEXT);
  }
}

export class LastnameFormFieldInput extends FormFieldInput {
  constructor(
    form: FormGroup,
    label = L_ENTER_LNAME,
    placeholder = P_ENTER_LNAME
  ) {
    super(label, form.get?.(LNAME), placeholder, BADGE, TEXT);
  }
}
