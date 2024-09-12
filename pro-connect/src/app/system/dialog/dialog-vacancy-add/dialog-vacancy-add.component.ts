import { TagLevelModel } from './../../../shared/models/backend/tag.model';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogVacancyAddData } from '../../../shared/interfaces/dialog-vacancy-add';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NameFormFieldInput, NoteFormFieldInput } from '../../inputs';
import { SAVE_BTN } from '../../../shared/phrases';
import { GroupService } from '../../../shared/services/group.service';
import { TagVacancyModel } from '../../../shared/models/backend/tag.model';
import { DialogSkillAddComponent } from '../dialog-skill-add/dialog-skill-add.component';
import { CONFIG_DIALOG } from '../../../shared/consts';
import { TagService } from '../../../shared/services/tag.service';
import { commonDelete } from '../../../shared/functions';

@Component({
  selector: 'app-dialog-vacancy-add',
  templateUrl: './dialog-vacancy-add.component.html',
  styleUrls: ['./dialog-vacancy-add.component.scss'],
})
export class DialogVacancyAddComponent implements OnInit {
  title = 'Вакансия';
  isChecked = true;
  saveBtn = SAVE_BTN;

  form = new FormGroup({
    name: new FormControl(this.data.vacancy.name, [Validators.required]),
    note: new FormControl(this.data.vacancy.description, [Validators.required]),
    isActive: new FormControl(this.data.vacancy.is_active, [
      Validators.required,
    ]),
  });

  nameInput = new NameFormFieldInput(this.form);
  noteInput = new NoteFormFieldInput(this.form);
  inputs = [this.nameInput, this.noteInput];
  levels: TagLevelModel[] = [];
  oldTags?: any[] = [];

  constructor(
    public groupService: GroupService,
    private tagService: TagService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogVacancyAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogVacancyAddData
  ) {}

  ngOnInit() {
    this.tagService.GetLevels().subscribe((levels) => {
      this.levels = levels;
    });

    this.isChecked = this.data.vacancy.is_active;
    if (this.data.vacancy.id != -1)
      this.groupService
        .GetVacancyById(this.data.vacancy.id)
        .subscribe((res) => {
          this.oldTags = JSON.parse(JSON.stringify(res.tags));
          this.data.vacancy = res;
        });
  }

  onChange() {
    // @ts-ignore
    this.isChecked = this.form.get('isActive')?.value;
  }

  isOpen() {
    return `Вакансия ${this.isChecked ? 'открыта' : 'закрыта'}`;
  }

  deleteTag(tag: TagVacancyModel) {
    if (this.data.vacancy.tags) commonDelete(this.data.vacancy.tags, tag);
  }

  addTag() {
    let tag = new TagVacancyModel(null, null);
    const dialogRef = this.dialog.open(DialogSkillAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        levels: this.levels,
        tag: tag,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.vacancy.tags?.push(result);
      }
    });
  }

  editTag(tag: TagVacancyModel) {
    this.dialog.open(DialogSkillAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        levels: this.levels,
        tag: tag,
      },
    });
  }

  save() {
    const { name, note, isActive } = this.form.value;

    if (name && note && isActive != undefined) {
      this.data.vacancy.created_at = new Date();
      this.data.vacancy.description = note;
      this.data.vacancy.name = name;
      this.data.vacancy.is_active = isActive;

      this.dialogRef.close({
        oldTags: this.oldTags,
        vacancy: this.data.vacancy,
      });
    }
  }
}
