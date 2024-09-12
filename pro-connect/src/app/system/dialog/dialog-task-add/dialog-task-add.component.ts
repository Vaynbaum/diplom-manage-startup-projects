import { DELETING_FILE } from './../../phrases';
import { CommonMaterial } from './../../../shared/models/backend/activity_task.model';
import { BirthdayFormFieldInput } from './../../inputs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTaskAddData } from '../../../shared/interfaces/dialog-task-add';
import { NameFormFieldInput } from '../../inputs';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';
import { ACCEPT_IMAGES } from '../../consts';
import {
  commonDelete,
  compileURLImg,
  onOpenFileDialog,
  showMessage,
} from '../../../shared/functions';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOADING_FILE } from '../../phrases';
import { deleteFile, loadFile } from '../../../shared/store/file/file.actions';
import {
  fileDeleted,
  fileUloaded,
} from '../../../shared/store/file/file.effects';
import { UploadFileModel } from '../../../shared/models/backend/upload_file.model';
interface UploadResult {
  isImg: boolean;
  name: string;
  url: string;
}
@Component({
  selector: 'app-dialog-task-add',
  templateUrl: './dialog-task-add.component.html',
  styleUrls: ['./dialog-task-add.component.scss'],
})
export class DialogTaskAddComponent implements OnInit, OnDestroy {
  title = 'Задача';
  files: CommonMaterial[] = [];
  saveBtn = { icon: SAVE_ICON, title: SAVE };
  acceptImages = ACCEPT_IMAGES;

  constructor(
    private store: Store,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogTaskAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTaskAddData
  ) {
    this.doUpload = this.doUpload.bind(this);
  }
  ngOnDestroy(): void {
    this.fus.unsubscribe();
  }

  form = new FormGroup({
    name: new FormControl(this.data.task?.name, [Validators.required]),
    description: new FormControl(this.data.task?.description),
    birthdate: new FormControl(this.data.task?.deadline),
  });
  inps = [new NameFormFieldInput(this.form)];
  birthdateInput = new BirthdayFormFieldInput(this.form, 'Срок выполнения');
  fus: any;
  ngOnInit() {
    if (this.data.task) this.files = this.data.task.files;

    this.fus = fileUloaded.subscribe((file) => {
      let ab = '.' + file.name.split('.').at(-1);
      let type = this.acceptImages.includes(ab) ? 'image' : 'file';
      let newFile = structuredClone(file);
      newFile.type = type;
      newFile.isJustAdded = true;
      this.files.push(newFile);
    });
  }
  checkIcon(file: CommonMaterial) {
    return file.type == 'image';
  }

  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    showMessage(this._snackBar, LOADING_FILE);
    return new Promise((resolve, reject) => {
      let image = files[0];
      let data = new UploadFileModel(image, false);
      this.store.dispatch(loadFile({ parametr: data }));
      let sub = fileUloaded.subscribe((file) => {
        sub.unsubscribe();
        let ab = '.' + file.name.split('.').at(-1);
        let isImg = this.acceptImages.includes(ab);
        let url = compileURLImg(file.name);
        let item = {
          name: file.details.old_name,
          url: url ? url : file.name,
          isImg: isImg,
        };
        resolve([item]);
      });
    });
  }

  deleteFile(file: CommonMaterial) {
    if (file.isJustAdded) {
      showMessage(this._snackBar, DELETING_FILE);
      this.store.dispatch(deleteFile({ parametr: file.id }));
      let sub = fileDeleted.subscribe((res) => {
        sub.unsubscribe();
        commonDelete(this.files, file);
      });
    } else commonDelete(this.files, file);
  }

  save() {
    const { name, description, birthdate } = this.form.value;

    if (name) {
      let task = this.data.task;
      task.name = name;
      task.description = description;
      task.deadline = birthdate;
      task.files = this.files;
      this.dialogRef.close(task);
    }
  }

  onOpenFileDialog(name: string) {
    onOpenFileDialog(name);
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    let image = fileList[0];
    showMessage(this._snackBar, LOADING_FILE);
    let data = new UploadFileModel(image, false);
    this.store.dispatch(loadFile({ parametr: data }));
  }
}
