import { LevelFormFieldInput } from './../../inputs';
import { CommonStatusModel } from '../../../shared/models/backend/status.model';
import { ActivityService } from './../../../shared/services/activity.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTaskData } from '../../../shared/interfaces/dialog-task-add';
import { GroupFormFieldInput } from '../../inputs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LEVEL } from '../../consts';
import {
  changeTaskStatus,
  getTasks,
} from '../../../shared/store/activity/activity.actions';
import { ChangeStatusModel } from '../../../shared/models/backend/activity_task.model';
import { Store } from '@ngrx/store';
import { anySuccess } from '../../../shared/store/common.effects';

@Component({
  selector: 'app-dialog-task-status',
  templateUrl: './dialog-task-status.component.html',
  styleUrls: ['./dialog-task-status.component.scss'],
})
export class DialogTaskStatusComponent implements OnInit {
  title = 'Смена статуса';
  selectedStatus: CommonStatusModel | null = null;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DialogTaskStatusComponent>,
    private activityService: ActivityService,
    @Inject(MAT_DIALOG_DATA) public data: DialogTaskData
  ) {}
  form = new FormGroup({
    level: new FormControl(this.data.task.status.name, [Validators.required]),
  });
  statusInput = new LevelFormFieldInput(this.form, 'Статус задачи');

  ngOnInit() {
    this.selectedStatus = this.data.task.status;
    this.activityService.GetTaskStatuses().subscribe((statuses) => {
      this.statusInput.loadData(statuses);
    });
  }
  saveBtn = { title: 'Изменить статус', icon: 'save' };

  setField(path: string, value: any) {
    this.form.get(path)?.setValue(value);
  }
  selectGroup(s: CommonStatusModel) {
    this.selectedStatus = s;
  }
  save() {
    const { level } = this.form.value;

    if (level && this.selectedStatus) {
      let d = new ChangeStatusModel(this.data.task.id, this.selectedStatus.id);
      this.store.dispatch(changeTaskStatus({ parametr: d }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.dialogRef.close();
        this.store.dispatch(getTasks({ parametr: this.data.task.activity_id }));
      });
    }
  }
}
