import { Component, Inject, OnInit } from '@angular/core';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailFormFieldInput } from '../../../shared/inputs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  loadMyProfile,
  resetEmail,
} from '../../../shared/store/profile/profile.actions';
import { anySuccess } from '../../../shared/store/common.effects';

@Component({
  selector: 'app-dialog-reset-email',
  templateUrl: './dialog-reset-email.component.html',
  styleUrls: ['./dialog-reset-email.component.scss'],
})
export class DialogResetEmailComponent implements OnInit {
  title = 'Смена email';
  saveBtn = { icon: SAVE_ICON, title: SAVE };
  form = new FormGroup({
    email: new FormControl(this.data.email, [
      Validators.required,
      Validators.email,
    ]),
  });
  inps = [new EmailFormFieldInput(this.form)];

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogResetEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  ngOnInit() {}
  save() {
    const { email } = this.form.value;
    if (email) {
      this.store.dispatch(resetEmail({ parametr: email }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.dialogRef.close();
        this.store.dispatch(loadMyProfile({}));
      });
    }
  }
}
