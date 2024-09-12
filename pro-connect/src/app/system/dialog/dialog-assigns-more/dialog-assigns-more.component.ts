import { PROFILE_PAGE, SYSTEM_MODULE } from './../../../shared/consts';
import { UserAbstractDBModel } from './../../../shared/models/backend/user_abstract.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DialogAssignsMoreData } from '../../../shared/interfaces/dialog-assigns-more';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { DEFAULT_AVA } from '../../consts';
import {
  commonDelete,
  compileURLImg,
  selectId,
} from '../../../shared/functions';
import { Router } from '@angular/router';
import {
  AssignTaskModel,
  TaskUserAssModel,
} from '../../../shared/models/backend/activity_task.model';
import { Store } from '@ngrx/store';
import {
  getTasks,
  unassignTask,
} from '../../../shared/store/activity/activity.actions';
import { anySuccess } from '../../../shared/store/common.effects';

@Component({
  selector: 'app-dialog-assigns-more',
  templateUrl: './dialog-assigns-more.component.html',
  styleUrls: ['./dialog-assigns-more.component.scss'],
})
export class DialogAssignsMoreComponent implements OnInit {
  title = 'Назначенные пользователи';
  responses: TaskUserAssModel[] = [];

  leaveBtn = {
    icon: 'close',
    title: 'Удалить из назначенных',
    actions: (res: TaskUserAssModel) => this.unassign(res),
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogAssignsMoreData,
    private store: Store,
    private router: Router,
    public dialogRef: MatDialogRef<DialogAssignsMoreComponent>
  ) {}

  ngOnInit() {
    this.responses = structuredClone(this.data.users);
  }

  unassign(res: TaskUserAssModel) {
    let d = new AssignTaskModel(res.task_id, res.user_id);
    this.store.dispatch(unassignTask({ parametr: d }));
    let sub = anySuccess.subscribe((_) => {
      sub.unsubscribe();
      commonDelete(this.responses, res);
      this.store.dispatch(getTasks({ parametr: this.data.activity_id }));
    });
  }

  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }

  goToUser(user: UserAbstractDBModel) {
    let id = selectId(user);
    let url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
    this.router.navigate([url]);
    this.dialogRef.close();
  }
}
