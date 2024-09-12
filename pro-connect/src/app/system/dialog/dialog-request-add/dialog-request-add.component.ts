import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupFormFieldInput } from '../../inputs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRequestAddData } from '../../../shared/interfaces/dialog-request-add';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { compileURLImg } from '../../../shared/functions';
import { DEFAULT_NO_PHOTO } from '../../consts';
import { Store } from '@ngrx/store';
import { GroupDBModel } from '../../../shared/models/backend/group.models';
import { CreateRequestModel } from '../../../shared/models/backend/activity_request.model';
import { addRequest } from '../../../shared/store/activity/activity.actions';

@Component({
  selector: 'app-dialog-request-add',
  templateUrl: './dialog-request-add.component.html',
  styleUrls: ['./dialog-request-add.component.scss'],
})
export class DialogRequestAddComponent implements OnInit {
  title = 'Заявка';
  saveBtn = { title: 'Отправить заявку', icon: 'send' };
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogRequestAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRequestAddData
  ) {}
  form = new FormGroup({
    group: new FormControl(null, [Validators.required]),
  });
  groupInput = new GroupFormFieldInput(this.form);
  selectedGroup: GroupDBModel | null = null;

  ngOnInit() {
    this.groupInput.loadData(this.data.groups);
  }

  selectGroup(g: GroupDBModel) {
    this.selectedGroup = g;
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }
  save() {
    const { group } = this.form.value;

    if (group && this.selectedGroup) {
      let d = new CreateRequestModel(
        this.selectedGroup.id,
        this.data.activity_id
      );
      this.store.dispatch(addRequest({ parametr: d }));
      this.dialogRef.close();
    }
  }
}
