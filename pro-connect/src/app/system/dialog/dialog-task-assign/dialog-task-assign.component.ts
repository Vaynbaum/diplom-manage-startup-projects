import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTaskWithUsersData } from '../../../shared/interfaces/dialog-task-add';
import { compileURLImg } from '../../../shared/functions';
import { DEFAULT_AVA } from '../../consts';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserAbstractDBModel } from '../../../shared/models/backend/user_abstract.model';
import { GroupFormFieldInput } from '../../inputs';
import { Store } from '@ngrx/store';
import { AssignTaskModel } from '../../../shared/models/backend/activity_task.model';
import {
  assignTask,
  getTasks,
} from '../../../shared/store/activity/activity.actions';
import { anySuccess } from '../../../shared/store/common.effects';

@Component({
  selector: 'app-dialog-task-assign',
  templateUrl: './dialog-task-assign.component.html',
  styleUrls: ['./dialog-task-assign.component.scss'],
})
export class DialogTaskAssignComponent implements OnInit {
  title = 'Назначение задачи';
  saveBtn = { title: 'Назначить задачу', icon: 'assignment_ind' };
  form = new FormGroup({
    group: new FormControl(null, [Validators.required]),
  });
  groupInput = new GroupFormFieldInput(
    this.form,
    'Пользователь',
    'Выберите пользователя'
  );
  selectedGroup: UserAbstractDBModel | null = null;
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogTaskAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTaskWithUsersData
  ) {}
  selectGroup(g: UserAbstractDBModel) {
    this.selectedGroup = g;
  }
  compileName(user: UserAbstractDBModel) {
    return `${user.lastname} ${user.firstname}`;
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }
  ngOnInit() {
    this.groupInput.loadData(this.data.users);
  }

  save() {
    const { group } = this.form.value;

    if (group && this.selectedGroup) {
      let d = new AssignTaskModel(this.data.task.id, this.selectedGroup.id);
      this.store.dispatch(assignTask({ parametr: d }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.store.dispatch(getTasks({ parametr: this.data.task.activity_id }));
        this.dialogRef.close();
      });
    }
  }
}
