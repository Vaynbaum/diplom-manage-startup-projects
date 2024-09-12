import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogGroupRoleAssignData } from '../../../shared/interfaces/dialog-group-role-assign';
import { GroupRoleModel } from '../../../shared/models/backend/group.models';
import { RoleFormFieldInput } from '../../inputs';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';

@Component({
  selector: 'app-dialog-assign-role',
  templateUrl: './dialog-assign-role.component.html',
  styleUrls: ['./dialog-assign-role.component.scss'],
})
export class DialogAssignRoleComponent implements OnInit {
  title = 'Назначить роль';
  selectedRole: GroupRoleModel | null = null;
  form = new FormGroup({
    role: new FormControl(this.data.user.role.name, [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<DialogAssignRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogGroupRoleAssignData
  ) {}
  roleInput = new RoleFormFieldInput(this.form);

  ngOnInit() {
    this.selectedRole = this.data.user.role;
    this.roleInput.loadData(this.data.roles);
  }

  selectRole(r: GroupRoleModel) {
    this.selectedRole = r;
  }
  saveBtn = { icon: SAVE_ICON, title: SAVE };

  save() {
    const { role } = this.form.value;
    if (
      role &&
      this.selectedRole &&
      this.data.user.role.id != this.selectedRole.id
    ) {
      this.data.user.role = this.selectedRole;
      this.dialogRef.close(this.data.user);
    }
  }
}
