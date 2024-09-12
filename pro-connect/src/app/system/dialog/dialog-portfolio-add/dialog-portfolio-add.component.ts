import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogPortfolioAddData } from '../../../shared/interfaces/dialog-portfolio-add';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  BirthdayFormFieldInput,
  NameFormFieldInput,
  NoteFormFieldInput,
  TypePortfolioFormFieldInput,
  ValueFormFieldInput,
} from '../../inputs';
import {
  PortfolioMaterial,
  PortfolioModel,
  PortfolioType,
  TagPortfolioModel,
} from '../../../shared/models/backend/portfolio.model';
import { SAVE, SAVE_ICON } from '../../../shared/phrases';
import { ACCEPT_IMAGES, ADD_ICON, FORMAT_DATE, LOCALE_RU } from '../../consts';
import {
  commonDelete,
  compileURLImg,
  onOpenFileDialog,
  showMessage,
} from '../../../shared/functions';
import { DELETING_FILE, LOADING_FILE } from '../../phrases';
import { UploadFileModel } from '../../../shared/models/backend/upload_file.model';
import { deleteFile, loadFile } from '../../../shared/store/file/file.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { CommonMaterial } from '../../../shared/models/backend/activity_task.model';
import {
  fileDeleted,
  fileUloaded,
} from '../../../shared/store/file/file.effects';
import { DialogTagAddComponent } from '../dialog-tag-add/dialog-tag-add.component';
import { CONFIG_DIALOG } from '../../../shared/consts';
import {
  ShortTagCreateIdModel,
  ShortTagCreateNameModel,
} from '../../../shared/models/backend/tag.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dialog-portfolio-add',
  templateUrl: './dialog-portfolio-add.component.html',
  styleUrls: ['./dialog-portfolio-add.component.scss'],
})
export class DialogPortfolioAddComponent implements OnInit, OnDestroy {
  title = 'Достижение';
  selectedType = this.data.types.at(-1);
  saveBtn = { icon: SAVE_ICON, title: SAVE };
  addButton = { icon: ADD_ICON, title: 'Добавить тег' };
  acceptImages = ACCEPT_IMAGES;
  currentMaterial: PortfolioMaterial | null = null;
  tags: TagPortfolioModel[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store,
    public dialogRef: MatDialogRef<DialogPortfolioAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPortfolioAddData
  ) {}
  ngOnDestroy(): void {
    this.fus.unsubscribe();
  }
  form = new FormGroup({
    name: new FormControl(this.data.portfolio.name, [Validators.required]),
    type: new FormControl(
      this.data.portfolio.type
        ? this.data.portfolio.type.name
        : this.selectedType?.name,
      [Validators.required]
    ),
    birthdate: new FormControl(this.data.portfolio.getted_at),
    note: new FormControl(this.data.portfolio.note),
    value: new FormControl(this.data.portfolio.value),
  });

  nameInput = new NameFormFieldInput(
    this.form,
    this.selectedType?.details.name.label,
    this.selectedType?.details.name.placeholder
  );
  valueInput = new ValueFormFieldInput(
    this.form,
    this.selectedType?.details.value.label,
    this.selectedType?.details.value.placeholder,
    this.selectedType?.details.value.icon
  );
  birthdateInput = new BirthdayFormFieldInput(this.form, 'Дата выдачи');
  noteInput = new NoteFormFieldInput(this.form, 'Подробное описание');
  typeInput = new TypePortfolioFormFieldInput(this.form);

  inputs = [this.nameInput, this.valueInput, this.noteInput];
  fus: any;
  ngOnInit() {
    this.currentMaterial = this.data.portfolio.material;

    this.fus = fileUloaded.subscribe((file) => {
      let ab = '.' + file.name.split('.').at(-1);
      let newFile = structuredClone(file);
      newFile.isJustAdded = true;
      // console.log(this.currentMaterial);
      // console.log(newFile);

      if (this.acceptImages.includes(ab)) {
        this.currentMaterial = { img: newFile };
      } else {
        this.currentMaterial = { file: newFile };
      }
    });

    if (this.data.portfolio.type) {
      this.selectedType = this.data.portfolio.type;
    }

    this.tags = structuredClone(this.data.portfolio.tags);

    this.typeInput.loadingData();
    this.typeInput.loadData(this.data.types);
  }

  selectType(type: PortfolioType) {
    this.selectedType = type;

    this.nameInput.label = this.selectedType?.details.name.label;
    this.nameInput._placeholder = this.selectedType?.details.name.placeholder;

    (this.valueInput.label = this.selectedType?.details.value.label),
      (this.valueInput._placeholder =
        this.selectedType?.details.value.placeholder),
      (this.valueInput._icon = this.selectedType?.details.value.icon);
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

  deleteFile(file: CommonMaterial | undefined) {
    if (file && file.isJustAdded) {
      showMessage(this._snackBar, DELETING_FILE);
      this.store.dispatch(deleteFile({ parametr: file.id }));
      let sub = fileDeleted.subscribe((res) => {
        sub.unsubscribe();
        this.currentMaterial = null;
      });
    } else this.currentMaterial = null;
  }

  compileURLImg(url: string | undefined) {
    if (url) return compileURLImg(url);
    return '';
  }
  addTag() {
    let tag = new TagPortfolioModel(null);
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

  deleteTag(link: TagPortfolioModel) {
    commonDelete(this.tags, link);
  }

  save() {
    const { name, value, note, birthdate } = this.form.value;
    let tags: ShortTagCreateIdModel[] = [];
    let tag_names: ShortTagCreateNameModel[] = [];
    let deleteds: number[] = [];

    this.tags.forEach((tag) => {
      if (this.checkChange(tag, this.data.portfolio?.tags)) {
        if (tag.tag?.id == -1) {
          let tagName = new ShortTagCreateNameModel(tag.tag.name);
          tag_names.push(tagName);
        } else if (tag.tag?.id) {
          let tagId = new ShortTagCreateIdModel(tag.tag?.id);
          tags.push(tagId);
        }
      }
    });

    if (this.data.portfolio?.tags) {
      this.data.portfolio?.tags.forEach((t) => {
        let res = this.tags.filter((ta) => t.tag?.id == ta.tag?.id);
        if (res && res.length == 0 && t.tag) {
          deleteds.push(t.tag.id);
        }
      });
    }
    if (name && this.selectedType) {
      let b = null;
      if (birthdate) {
        b = formatDate(birthdate, FORMAT_DATE, LOCALE_RU);
      }
      let p = new PortfolioModel(
        -1,
        name,
        this.selectedType?.id,
        this.selectedType,
        note,
        value,
        null,
        null,
        null,
        b,
        this.currentMaterial,
        this.tags
      );
      this.dialogRef.close({
        portfolio: p,
        tags: tags,
        tag_names: tag_names,
        deleteds: deleteds,
      });
    }
  }

  checkChange(skill: TagPortfolioModel, tags?: TagPortfolioModel[]) {
    if (tags) {
      let res = tags.filter((t) => t.tag?.id == skill.tag?.id);
      return !(res.length > 0);
    }
    return true;
  }
}
