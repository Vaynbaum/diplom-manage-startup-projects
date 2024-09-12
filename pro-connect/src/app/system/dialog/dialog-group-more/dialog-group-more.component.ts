import { Component, Inject, OnInit } from '@angular/core';
import { CONTACTS, CREATE_DAY, TITLE_MORE_INFORMATION } from '../../phrases';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogGroupMoreData } from '../../../shared/interfaces/dialog-group-more';
import { GROUP_PAGE, NICK, SYSTEM_MODULE } from '../../../shared/consts';
import {
  compileUrlImgAssets,
  isIcon,
  selectId,
  showMessage,
} from '../../../shared/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactGroupModel } from '../../../shared/models/backend/contact.model';

@Component({
  selector: 'app-dialog-group-more',
  templateUrl: './dialog-group-more.component.html',
  styleUrls: ['./dialog-group-more.component.scss'],
})
export class DialogGroupMoreComponent implements OnInit {
  title = TITLE_MORE_INFORMATION;
  link = {
    icon: NICK,
    data: this.compileUsername(),
    link: `/${SYSTEM_MODULE}/${GROUP_PAGE}/`,
  };
  note = {
    icon: 'notes',
    data: this.data.group.note,
  };
  calendar = {
    show: this.data.group.created_at,
    icon: 'calendar_month',
    title: `${CREATE_DAY}:`,
    data: this.data.group.created_at,
    mask: 'dd MMMM yyyy г.',
    needDiv: this.existContacts(),
  };
  contact = {
    show: this.existContacts(),
    title: CONTACTS,
    items: this.data.group.contacts,
    icon: 'link',
    needDiv: false,
  };
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogGroupMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogGroupMoreData
  ) {}

  compileUsername() {
    return selectId(this.data.group);
  }

  existContacts() {
    return this.data.group.contacts.length;
  }

  ngOnInit() {
    this.link.link += this.link.data;
  }

  compileImgLogoContact(icon?: string) {
    return compileUrlImgAssets(icon);
  }

  splitLink(contactLink: ContactGroupModel) {
    if (contactLink?.contact?.prefix) {
      let splits = contactLink.value.split(contactLink?.contact?.prefix);
      return `@${splits[splits.length - 1]}`;
    } else if (contactLink.value.includes('http')) {
      let splits = contactLink.value.split('://');
      return splits[splits.length - 1];
    }
    return contactLink.value;
  }

  isNeedIcon(icon?: string) {
    return !icon || isIcon(icon);
  }

  redirectValue(contactLink: ContactGroupModel) {
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
}
