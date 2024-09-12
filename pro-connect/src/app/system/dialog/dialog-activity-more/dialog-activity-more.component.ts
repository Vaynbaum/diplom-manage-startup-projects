import { GROUP_PAGE, SYSTEM_MODULE } from './../../../shared/consts';
import { Component, Inject, OnInit } from '@angular/core';
import { CONTACTS, TITLE_MORE_INFORMATION } from '../../phrases';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogActivityMoreData } from '../../../shared/interfaces/dialog-activity-more';
import { TagVacancyModel } from '../../../shared/models/backend/tag.model';
import { DialogTagMoreComponent } from '../dialog-tag-more/dialog-tag-more.component';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import {
  compileURLImg,
  compileUrlImgAssets,
  isIcon,
  selectId,
  showMessage,
} from '../../../shared/functions';
import { DEFAULT_NO_PHOTO } from '../../consts';
import { Router } from '@angular/router';
import { ContactActivityModel } from '../../../shared/models/backend/contact.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-activity-more',
  templateUrl: './dialog-activity-more.component.html',
  styleUrls: ['./dialog-activity-more.component.scss'],
})
export class DialogActivityMoreComponent implements OnInit {
  title = TITLE_MORE_INFORMATION;
  note = {
    icon: 'notes',
    data: this.data.activity.description,
  };
  isSkillShow? = false;
  contact = {
    show: this.data.activity.contacts.length,
    title: CONTACTS,
    items: this.data.activity.contacts,
    icon: 'link',
    needDiv: false,
  };
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<DialogActivityMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogActivityMoreData
  ) {}

  ngOnInit() {
    this.isSkillShow =
      this.data.activity.tags && this.data.activity.tags.length > 0;
  }

  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }

  goTo() {
    if (this.data.activity.group) {
      let id = selectId(this.data.activity.group);
      let url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${id}`;
      this.router.navigate([url]);
      this.dialogRef.close();
    }
  }
  isNeedIcon(icon?: string) {
    return !icon || isIcon(icon);
  }

  compileImgLogoContact(icon?: string) {
    return compileUrlImgAssets(icon);
  }

  redirectValue(contactLink: ContactActivityModel) {
    if (contactLink.contact?.is_redirect)
      window.open(contactLink.value, '_blank');
    else {
      navigator.clipboard
        .writeText(contactLink.value)
        .then(() => {
          showMessage(
            this._snackBar,
            contactLink.contact?.details?.copy_sucess
          );
        })
        .catch((err) => {
          showMessage(this._snackBar, contactLink.contact?.details?.copy_fail);
        });
    }
  }

  splitLink(contactLink: ContactActivityModel) {
    if (contactLink?.contact?.prefix) {
      let splits = contactLink.value.split(contactLink?.contact?.prefix);
      return `@${splits[splits.length - 1]}`;
    } else if (contactLink.value.includes('http')) {
      let splits = contactLink.value.split('://');
      return splits[splits.length - 1];
    }
    return contactLink.value;
  }

  sTitle(s: string) {
    return s.replace(s[0], s[0].toUpperCase());
  }
}
