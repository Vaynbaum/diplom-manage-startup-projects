import { groupAdded } from './../../../shared/store/group/group.effects';
import { createGroup } from './../../../shared/store/group/group.actions';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SAVE_BTN } from '../../../shared/phrases';
import {
  NameFormFieldInput,
  NoteFormFieldInput,
  TypeGroupFormFieldInput,
} from '../../inputs';
import { GroupService } from '../../../shared/services/group.service';
import { GroupCreateModel } from '../../../shared/models/backend/group.models';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonTypeModel } from '../../../shared/models/backend/type.model';

@Component({
  selector: 'app-dialog-group-add',
  templateUrl: './dialog-group-add.component.html',
  styleUrls: ['./dialog-group-add.component.scss'],
})
export class DialogGroupAddComponent implements OnInit {
  title = 'Создание группы';
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    note: new FormControl(null),
    type: new FormControl(null, [Validators.required]),
  });

  saveBtn = SAVE_BTN;

  selectedType?: CommonTypeModel;

  typeInput = new TypeGroupFormFieldInput(this.form);
  inps = [new NameFormFieldInput(this.form), new NoteFormFieldInput(this.form)];

  constructor(
    private groupService: GroupService,
    private store: Store<{}>,
    public dialogRef: MatDialogRef<DialogGroupAddComponent>
  ) {}

  ngOnInit() {
    this.typeInput.loadingData();
    this.groupService.GetAllTypes().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }

  selectType(type: CommonTypeModel) {
    this.selectedType = type;
  }

  save() {
    const { name, note, type } = this.form.value;

    if (this.selectedType && name &&  type) {
      let data = new GroupCreateModel(name, this.selectedType.id,note);
      this.store.dispatch(createGroup({ parametr: data }));
      let s = groupAdded.subscribe((res) => {
        s.unsubscribe();
        this.dialogRef.close();
      });
    }
  }
}
