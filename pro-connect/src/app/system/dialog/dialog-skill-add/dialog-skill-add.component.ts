import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SKILL } from '../../phrases';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogSkillAddData } from '../../../shared/interfaces/dialog-skill-add';
import { LevelFormFieldInput, TagFormFieldInput } from '../../inputs';
import { TagLevelModel, TagModel } from '../../../shared/models/backend/tag.model';
import { TagService } from '../../../shared/services/tag.service';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';

@Component({
  selector: 'app-dialog-skill-add',
  templateUrl: './dialog-skill-add.component.html',
  styleUrls: ['./dialog-skill-add.component.scss'],
})
export class DialogSkillAddComponent implements OnInit {
  title = SKILL;
  selectedLevel: TagLevelModel | null = null;
  selectedTag: TagModel | null = null;
  saveBtn = { icon: SAVE_ICON, title: SAVE };

  form = new FormGroup({
    level: new FormControl(this.data.tag.level?.name, [Validators.required]),
    skill: new FormControl(this.data.tag.tag?.name, [Validators.required]),
  });

  levelInput = new LevelFormFieldInput(this.form);
  tagInput = new TagFormFieldInput(this.form);

  constructor(
    public dialogRef: MatDialogRef<DialogSkillAddComponent>,
    private tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: DialogSkillAddData
  ) {}

  ngOnInit() {
    this.selectedLevel = this.data.tag.level;
    this.selectedTag = this.data.tag.tag;
    this.levelInput.loadData(this.data.levels);
    this.loadTags();
  }

  selectLevel(level: TagLevelModel) {
    this.selectedLevel = level;
  }

  selectTag(tag: TagModel) {
    this.selectedTag = tag;
  }

  loadTags(substr?: string) {
    this.tagInput.loadingData();
    this.tagService.GetTags(substr).subscribe((tags) => {
      this.tagInput.loadData(tags);
    });
  }

  onKeyupTag() {
    let v: string = this.tagInput.formControl.value;
    if (v) this.loadTags(v);
  }

  save() {
    const { level, skill } = this.form.value;
    if (level && this.selectedLevel) this.data.tag.level = this.selectedLevel;

    if (skill) {
      if (this.selectedTag && this.selectedTag != this.data.tag.tag) {
        this.data.tag.tag = this.selectedTag;
      } else if (skill != this.data.tag.tag?.name) {
        let t = new TagModel(skill, -1);
        this.data.tag.tag = t;
      }

      this.dialogRef.close(this.data.tag);
    }
  }
}
