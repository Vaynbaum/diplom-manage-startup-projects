import { profileInitialState } from './../../../shared/store/profile/profile.reducer';
import { GroupService } from './../../../shared/services/group.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogVacancyMoreData } from '../../../shared/interfaces/dialog-vacancy-more';
import { TagVacancyModel } from '../../../shared/models/backend/tag.model';
import { DialogTagMoreComponent } from '../dialog-tag-more/dialog-tag-more.component';
import { UserAbstractModel } from '../../../shared/models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  NAME_REDUCER_GROUP,
  NAME_REDUCER_PROFILE,
} from '../../../shared/consts';
import { createResponseVacancy } from '../../../shared/store/group/group.actions';
import { FullGroupModel } from '../../../shared/models/backend/group.models';
import { GROUP_ROLE_OBSERVER } from '../../consts';
import { compileURLImg } from '../../../shared/functions';

@Component({
  selector: 'app-dialog-vacancy-more',
  templateUrl: './dialog-vacancy-more.component.html',
  styleUrls: ['./dialog-vacancy-more.component.scss'],
})
export class DialogVacancyMoreComponent implements OnInit, OnDestroy {
  title = 'Вакансия';
  isSkillShow? = false;
  showBtn = false;
  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);

  group?: FullGroupModel;
  group$: Observable<FullGroupModel> = this.store.select(NAME_REDUCER_GROUP);
  constructor(
    public dialog: MatDialog,
    public groupService: GroupService,
    private store: Store<{ profile: UserAbstractModel; group: FullGroupModel }>,
    public dialogRef: MatDialogRef<DialogVacancyMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogVacancyMoreData
  ) {}
  ngOnDestroy(): void {
    this.ps.unsubscribe();
    this.gs.unsubscribe();
  }
  ps: any;
  gs: any;
  ngOnInit() {
    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      if (this.data.vacancy.users) this.checkClick(this.data.vacancy.users);
    });

    this.gs = this.group$?.subscribe((res: FullGroupModel) => {
      this.group = res;

      if (this.data.vacancy.users) this.checkClick(this.data.vacancy.users);
    });

    this.groupService.GetVacancyById(this.data.vacancy.id).subscribe((res) => {
      this.data.vacancy = res;
      if (this.profile) this.checkClick(res.users);
      this.isSkillShow = res.tags && res.tags.length > 0;
    });
  }

  checkClick(users?: any[]) {
    let r = users?.find((user) => user.user_id == this.profile.id);
    if (r) this.showBtn = false;
    else if (this.profile && this.group) {
      let res = this.group.users.filter((u) => u.user.id == this.profile.id);
      if (res.length > 0) {
        let role_id = res[0].role.id;
        if (role_id == GROUP_ROLE_OBSERVER) this.showBtn = true;
        else this.showBtn = false;
      } else this.showBtn = true;
    } else this.showBtn = true;
  }

  createResponse() {
    this.store.dispatch(
      createResponseVacancy({ parametr: this.data.vacancy.id })
    );
    this.showBtn = false;
  }

  onClickChip(tagLink: TagVacancyModel) {
    this.dialog.open(DialogTagMoreComponent, {
      data: {
        tagLink: tagLink,
      },
    });
  }
}
