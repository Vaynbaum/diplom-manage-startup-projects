import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogInviteAddData } from '../../../shared/interfaces/dialog-invite-add';
import { Store } from '@ngrx/store';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { compileURLImg, selectId } from '../../../shared/functions';
import { DEFAULT_AVA } from '../../consts';
import { UserAbstractDBModel } from '../../../shared/models/backend/user_abstract.model';
import { PROFILE_PAGE, SYSTEM_MODULE } from '../../../shared/consts';
import { Router } from '@angular/router';
import { addInvite } from '../../../shared/store/group/group.actions';
import { CreateIviteModel } from '../../../shared/models/backend/response_invite.model';

@Component({
  selector: 'app-dialog-invite-add',
  templateUrl: './dialog-invite-add.component.html',
  styleUrls: ['./dialog-invite-add.component.scss'],
})
export class DialogInviteAddComponent implements OnInit {
  title = 'Приглашение в группу';
  constructor(
    private router: Router,
    private store: Store,
    public dialogRef: MatDialogRef<DialogInviteAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInviteAddData
  ) {}

  ngOnInit() {}

  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }
  goToUser(user: UserAbstractDBModel) {
    let id = selectId(user);
    let url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
    this.router.navigate([url]);
    this.dialogRef.close();
  }
  sendInvite(user: UserAbstractDBModel) {
    let d = new CreateIviteModel(this.data.group_id, user.id);
    this.store.dispatch(addInvite({ parametr: d }));
  }
}
