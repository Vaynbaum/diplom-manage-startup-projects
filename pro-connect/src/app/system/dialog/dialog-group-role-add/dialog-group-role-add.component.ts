import { Component, Inject, OnInit } from '@angular/core';
import { SAVE_BTN } from '../../../shared/phrases';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogGroupRoleAddData } from '../../../shared/interfaces/dialog-group-role-add';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupRoleFormFieldInput } from '../../inputs';

@Component({
  selector: 'app-dialog-group-role-add',
  templateUrl: './dialog-group-role-add.component.html',
  styleUrls: ['./dialog-group-role-add.component.scss'],
})
export class DialogGroupRoleAddComponent implements OnInit {
  title = 'Роль';
  saveBtn = SAVE_BTN;

  form = new FormGroup({
    role: new FormControl(this.data.role.name, [Validators.required]),
  });

  roleInput = new GroupRoleFormFieldInput(this.form);

  constructor(
    public dialogRef: MatDialogRef<DialogGroupRoleAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogGroupRoleAddData
  ) {}

  ngOnInit() {}

  save() {
    const { role } = this.form.value;
    if (role) {
      this.data.role.name = role;
      this.dialogRef.close(this.data.role);
    }
  }
}
