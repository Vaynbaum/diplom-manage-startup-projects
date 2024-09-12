import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagService } from '../../../shared/services/tag.service';
import { DialogTagAddData } from '../../../shared/interfaces/dialog-skill-add';
import { TagFormFieldInput } from '../../inputs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TagModel } from '../../../shared/models/backend/tag.model';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';

@Component({
  selector: 'app-dialog-tag-add',
  templateUrl: './dialog-tag-add.component.html',
  styleUrls: ['./dialog-tag-add.component.scss'],
})
export class DialogTagAddComponent implements OnInit {
  title = 'Тег';
  selectedTag: TagModel | null = null;
  saveBtn = { icon: SAVE_ICON, title: SAVE };

  form = new FormGroup({
    skill: new FormControl(this.data.tag.tag?.name, [Validators.required]),
  });

  tagInput = new TagFormFieldInput(this.form);

  constructor(
    public dialogRef: MatDialogRef<DialogTagAddComponent>,
    private tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: DialogTagAddData
  ) {}
  loadTags(substr?: string) {
    this.tagInput.loadingData();
    this.tagService.GetTags(substr).subscribe((tags) => {
      this.tagInput.loadData(tags);
    });
  }

  ngOnInit() {
    this.selectedTag = this.data.tag.tag;
    this.loadTags();
  }

  selectTag(tag: TagModel) {
    this.selectedTag = tag;
  }
  onKeyupTag() {
    let v: string = this.tagInput.formControl.value;
    if (v) this.loadTags(v);
  }

  save() {
    const { skill } = this.form.value;

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
