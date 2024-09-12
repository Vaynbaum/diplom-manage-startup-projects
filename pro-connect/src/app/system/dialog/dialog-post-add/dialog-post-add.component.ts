import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  commonDelete,
  compileURLImg,
  DURATION_MESSAGE,
  OK,
  onOpenFileDialog,
  showMessage,
} from '../../../shared/functions';
import { DELETING_FILE, LOADING_FILE } from '../../phrases';
import { UploadResult } from 'ngx-markdown-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { deleteFile, loadFile } from '../../../shared/store/file/file.actions';
import {
  fileDeleted,
  fileUloaded,
} from '../../../shared/store/file/file.effects';
import { ACCEPT_IMAGES, ADD_ICON } from '../../consts';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';
import {
  CommonMaterial,
  FileModel,
} from '../../../shared/models/backend/activity_task.model';
import {
  ShortTagCreateIdModel,
  ShortTagCreateNameModel,
  TagPostModel,
} from '../../../shared/models/backend/tag.model';
import { DialogPostAddData } from '../../../shared/interfaces/dialog-psot-add';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CONFIG_DIALOG } from '../../../shared/consts';
import { DialogTagAddComponent } from '../dialog-tag-add/dialog-tag-add.component';
import { UploadFileModel } from '../../../shared/models/backend/upload_file.model';
import {
  CreatePostModel,
  UpdatePostModel,
} from '../../../shared/models/backend/post.model';
import {
  createPost,
  updatePost,
} from '../../../shared/store/post/post.actions';
import { anySuccess } from '../../../shared/store/common.effects';

const UploadFileDialogPostAddComponent = new EventEmitter<Array<File>>();
const UploadedFileDialogPostAddComponent = new EventEmitter<Array<any>>();

@Component({
  selector: 'app-dialog-post-add',
  templateUrl: './dialog-post-add.component.html',
  styleUrls: ['./dialog-post-add.component.scss'],
})
export class DialogPostAddComponent implements OnInit, OnDestroy {
  saveBtn = { icon: SAVE_ICON, title: SAVE };
  files: CommonMaterial[] = [];
  tags: TagPostModel[] = [];
  addButton = { icon: ADD_ICON, title: 'Добавить тег' };
  title = 'Новость';
  acceptImages = ACCEPT_IMAGES;
  fruitCtrl = new FormControl('');
  form = new FormGroup({
    description: new FormControl(this.data.post?.text),
    fruit: this.fruitCtrl,
  });

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPostAddComponent>,
    private _snackBar: MatSnackBar,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: DialogPostAddData
  ) {}
  ngOnDestroy(): void {
    this.fus.unsubscribe();
  }
  fus: any;
  ngOnInit() {
    UploadFileDialogPostAddComponent.subscribe((files: Array<File>) => {
      this.doUploadWithThis(files);
    });
    this.fus = fileUloaded.subscribe((file) => {
      let ab = '.' + file.name.split('.').at(-1);
      let newFile = structuredClone(file);
      newFile.type = this.acceptImages.includes(ab) ? 'image' : 'file';
      newFile.isJustAdded = true;
      this.files.push(newFile);
    });

    this.files = structuredClone(this.data.files);

    if (this.data?.post) {
      this.tags = structuredClone(this.data.post.tags);
    }
  }

  doUploadWithThis(files: Array<File>) {
    showMessage(this._snackBar, LOADING_FILE);
    let image = files[0];
    let ab = '.' + image.name.split('.').at(-1);
    let isImg = this.acceptImages.includes(ab);
    let data = new UploadFileModel(image, isImg);
    this.store.dispatch(loadFile({ parametr: data }));
    let sub = fileUloaded.subscribe((file) => {
      sub.unsubscribe();
      let url = compileURLImg(file.name);
      let item = {
        name: file.details.old_name,
        url: url ? url : file.name,
        isImg: isImg,
      };
      UploadedFileDialogPostAddComponent.emit([item]);
    });
  }

  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    return new Promise((resolve, reject) => {
      UploadFileDialogPostAddComponent.emit(files);
      let sub = UploadedFileDialogPostAddComponent.subscribe((file) => {
        sub.unsubscribe();
        resolve(file);
      });
    });
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
    let ab = '.' + image.name.split('.').at(-1);
    let isImg = this.acceptImages.includes(ab);
    let data = new UploadFileModel(image, isImg);
    this.store.dispatch(loadFile({ parametr: data }));
  }
  save() {
    const { description } = this.form.value;
    if (!description && this.files.length == 0) return;
    if (this.data.post) {
      let addFiles: FileModel[] = [];
      let deleteIds: number[] = [];

      this.data.post.materials.files.forEach((material) => {
        let arr = this.files.filter((c) => c.id === material.id);
        if (arr.length == 0) deleteIds.push(material.id);
      });
      this.data.post.materials.images.forEach((material) => {
        let arr = this.files.filter((c) => c.id === material.id);
        if (arr.length == 0) deleteIds.push(material.id);
      });
      this.files.forEach((material) => {
        let arr1 = this.data.post?.materials.files.filter(
          (c) => c.id === material.id
        );
        let arr2 = this.data.post?.materials.images.filter(
          (c) => c.id === material.id
        );
        if (arr1?.length == 0 && arr2?.length == 0) addFiles.push(material);
      });

      let tags: ShortTagCreateIdModel[] = [];
      let tag_names: ShortTagCreateNameModel[] = [];
      let deleteds: number[] = [];

      this.tags.forEach((tag) => {
        if (this.checkChange(tag, this.data.post?.tags)) {
          if (tag.tag?.id == -1) {
            let tagName = new ShortTagCreateNameModel(tag.tag.name);
            tag_names.push(tagName);
          } else if (tag.tag?.id) {
            let tagId = new ShortTagCreateIdModel(tag.tag?.id);
            tags.push(tagId);
          }
        }
      });

      if (this.data.post?.tags) {
        this.data.post?.tags.forEach((t) => {
          let res = this.tags.filter((ta) => t.tag?.id == ta.tag?.id);
          if (res && res.length == 0 && t.tag) {
            deleteds.push(t.tag.id);
          }
        });
      }

      let data = new UpdatePostModel(
        this.data.post.id,
        tags,
        tag_names,
        deleteds,
        addFiles,
        deleteIds,
        description
      );
      this.store.dispatch(updatePost({ parametr: data }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.dialogRef.close(res);
      });
    } else {
      let arr: ShortTagCreateIdModel[] = [];
      let arrNames: ShortTagCreateNameModel[] = [];
      this.tags.forEach((tag) => {
        if (tag.tag && tag.tag.id > -1)
          arr.push(new ShortTagCreateIdModel(tag.tag.id));
      });
      this.tags.forEach((tag) => {
        if (tag.tag && tag.tag.id == -1)
          arrNames.push(new ShortTagCreateNameModel(tag.tag.name));
      });

      let data = new CreatePostModel(
        arr,
        arrNames,
        this.files,
        description,
        this.data.activity_id,
        this.data.group_id
      );
      this.store.dispatch(createPost({ parametr: data }));
      let sub = anySuccess.subscribe((res) => {
        sub.unsubscribe();
        this.dialogRef.close(res);
      });
    }
  }
  checkChange(skill: TagPostModel, tags?: TagPostModel[]) {
    if (tags) {
      let res = tags.filter((t) => t.tag?.id == skill.tag?.id);
      return !(res.length > 0);
    }
    return true;
  }
  checkIcon(file: CommonMaterial) {
    return file.type == 'image';
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
  compileURLImg(url: string) {
    return compileURLImg(url);
  }

  drop(event: CdkDragDrop<CommonMaterial[]>) {
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);
  }
  addTag() {
    let tag = new TagPostModel(null);
    const dialogRef = this.dialog.open(DialogTagAddComponent, {
      ...CONFIG_DIALOG,
      data: {
        tag: tag,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tags.push(result);
      }
    });
  }

  deleteTag(link: TagPostModel) {
    commonDelete(this.tags, link);
  }
}
