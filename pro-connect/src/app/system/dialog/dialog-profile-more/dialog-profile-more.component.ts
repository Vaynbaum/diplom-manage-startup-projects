import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogProfileMoreData } from '../../../shared/interfaces/dialog-profile-more';
import {
  CONTACTS,
  L_ENTER_BIRTHDAY,
  L_ENTER_CITY,
  SKILLS,
  TITLE_MORE_INFORMATION,
} from '../../phrases';
import { TagUserModel } from '../../../shared/models/backend/tag.model';
import { DialogTagMoreComponent } from '../dialog-tag-more/dialog-tag-more.component';
import {
  compileUrlImgAssets,
  isIcon,
  selectId,
  showMessage,
} from '../../../shared/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LINK_PAGE_PROFILE_SHORT,
  LOCATION,
  NICK,
} from '../../../shared/consts';
import { ContactUserModel } from '../../../shared/models/backend/contact.model';

@Component({
  selector: 'app-dialog-profile-more',
  templateUrl: './dialog-profile-more.component.html',
  styleUrls: ['./dialog-profile-more.component.scss'],
})
export class DialogProfileMoreComponent implements OnInit {
  title = TITLE_MORE_INFORMATION;
  link = {
    icon: NICK,
    data: this.compileUsername(),
    needDiv: this.existMoreInfo() || this.existContacts() || this.existSkills(),
    link: `${LINK_PAGE_PROFILE_SHORT}/`,
  };
  calendar = {
    show: this.data.profile.user?.birthdate,
    icon: 'calendar_month',
    title: `${L_ENTER_BIRTHDAY}:`,
    data: this.data.profile.user?.birthdate,
    mask: 'dd MMMM yyyy г.',
  };
  location = {
    show: this.data.profile.user?.city?.name,
    icon: LOCATION,
    title: `${L_ENTER_CITY}:`,
    data: this.data.profile.user?.city?.name,
  };
  contact = {
    show: this.existContacts(),
    title: CONTACTS,
    items: this.data.profile.user?.contacts,
    icon: 'link',
    needDiv: this.existSkills(),
  };
  skill = {
    title: SKILLS,
    show: this.existSkills(),
  };

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogProfileMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogProfileMoreData
  ) {}

  ngOnInit() {
    this.link.link += this.link.data;
  }

  compileUsername() {
    return selectId(this.data.profile);
  }

  existMoreInfo() {
    let u = this.data.profile.user;
    return u?.city?.name || u?.birthdate;
  }

  existContacts() {
    return this.data.profile.user?.contacts?.length;
  }

  existSkills() {
    return this.data.profile.user?.tags?.length;
  }

  isNeedTwoDivider() {
    return this.existMoreInfo() && (this.contact.show || this.skill.show);
  }

  isNeedThreeDivider() {
    return this.contact.show && this.skill.show;
  }

  isNeedIcon(icon?: string) {
    return !icon || isIcon(icon);
  }

  compileImgLogoContact(icon?: string) {
    return compileUrlImgAssets(icon);
  }

  splitLink(contactLink: ContactUserModel) {
    if (contactLink?.contact?.prefix) {
      let splits = contactLink.value.split(contactLink?.contact?.prefix);
      return `@${splits[splits.length - 1]}`;
    } else if (contactLink.value.includes('http')) {
      let splits = contactLink.value.split('://');
      return splits[splits.length - 1];
    }
    return contactLink.value;
  }

  redirectValue(contactLink: ContactUserModel) {
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

  onClickChip(tagLink: TagUserModel) {
    const dialogRef = this.dialog.open(DialogTagMoreComponent, {
      data: {
        tagLink: tagLink,
      },
    });
  }
}
