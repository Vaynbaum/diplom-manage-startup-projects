import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ActivityService } from './../../../shared/services/activity.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SAVE_BTN } from '../../../shared/phrases';
import { CommonStatusModel } from '../../../shared/models/backend/status.model';
import {
  DirectionFormFieldInput,
  NameFormFieldInput,
  NoteFormFieldInput,
  StatusActFormFieldInput,
} from '../../inputs';
import {
  ActivityCreateModel,
  DirectionModel,
} from '../../../shared/models/backend/activity.model';
import { createActivity } from '../../../shared/store/activity/activity.actions';
import { activityAdded } from '../../../shared/store/activity/activity.effects';

@Component({
  selector: 'app-dialog-activity-add',
  templateUrl: './dialog-activity-add.component.html',
  styleUrls: ['./dialog-activity-add.component.scss'],
})
export class DialogActivityAddComponent implements OnInit {
  title = 'Создание проекта';
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    note: new FormControl(null),
    status: new FormControl(null, [Validators.required]),
    direction: new FormControl(null, [Validators.required]),
  });

  saveBtn = SAVE_BTN;
  selectedStatus?: CommonStatusModel;
  selectedDirection?: DirectionModel;
  directionInput = new DirectionFormFieldInput(this.form);
  statusInput = new StatusActFormFieldInput(this.form);
  inps = [new NameFormFieldInput(this.form), new NoteFormFieldInput(this.form)];

  constructor(
    private activityService: ActivityService,
    private store: Store<{}>,
    public dialogRef: MatDialogRef<DialogActivityAddComponent>
  ) {}

  ngOnInit() {
    this.directionInput.loadingData();
    this.activityService.GetAllDirections().subscribe(
      (result) => {
        this.directionInput.loadData(result);
      },
      (err) => {}
    );

    this.statusInput.loadingData();
    this.activityService.GetAllStatuses().subscribe(
      (result) => {
        this.statusInput.loadData(result);
      },
      (err) => {}
    );
  }
  selectDirection(direction: DirectionModel) {
    this.selectedDirection = direction;
  }

  selectType(status: CommonStatusModel) {
    this.selectedStatus = status;
  }

  save() {
    const { name, note, status, direction } = this.form.value;

    if (
      this.selectedStatus &&
      this.selectedDirection &&
      name &&
      status &&
      direction
    ) {
      let data = new ActivityCreateModel(
        name,
        this.selectedStatus.id,
        this.selectedDirection.id,
        note
      );
      this.store.dispatch(createActivity({ parametr: data }));
      let s = activityAdded.subscribe((res) => {
        s.unsubscribe();
        this.dialogRef.close();
      });
    }
  }
}
