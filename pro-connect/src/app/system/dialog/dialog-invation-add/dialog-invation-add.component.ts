import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivityDBModel } from '../../../shared/models/backend/activity.model';
import { ActivityFormFieldInput } from '../../inputs';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogInvationAddData } from '../../../shared/interfaces/dialog-request-add';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { compileURLImg } from '../../../shared/functions';
import { DEFAULT_NO_PHOTO } from '../../consts';
import { CreateRequestModel } from '../../../shared/models/backend/activity_request.model';
import { addInvitation } from '../../../shared/store/activity/activity.actions';

@Component({
  selector: 'app-dialog-invation-add',
  templateUrl: './dialog-invation-add.component.html',
  styleUrls: ['./dialog-invation-add.component.scss'],
})
export class DialogInvationAddComponent implements OnInit {
  title = 'Приглашение';
  saveBtn = { title: 'Отправить приглашение', icon: 'send' };
  form = new FormGroup({
    activity: new FormControl(null, [Validators.required]),
  });
  groupInput = new ActivityFormFieldInput(this.form);
  selectedActivity: ActivityDBModel | null = null;
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogInvationAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInvationAddData
  ) {}

  ngOnInit() {
    this.groupInput.loadData(this.data.activities);
  }
  selectGroup(g: ActivityDBModel) {
    this.selectedActivity = g;
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }
  save() {
    const { activity } = this.form.value;

    if (activity && this.selectedActivity) {
      let d = new CreateRequestModel(
        this.data.group_id,
        this.selectedActivity.id
      );
      this.store.dispatch(addInvitation({ parametr: d }));
      this.dialogRef.close();
    }
  }
}
