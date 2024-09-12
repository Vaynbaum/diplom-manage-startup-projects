import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { GroupService } from '../../../shared/services/group.service';
import { DialogVacancyResponsesData } from '../../../shared/interfaces/dialog-vacancy-responses';
import {
  ResponseApproveModel,
  VacancyResponseModel,
} from '../../../shared/models/backend/vacancy_response.model';
import { AvatarModel } from '../../../shared/models/backend/avatar.model';
import { compileURLImg, selectId } from '../../../shared/functions';
import { DEFAULT_AVA, MORE_VERT_ICON } from '../../consts';
import { Store } from '@ngrx/store';
import {
  approveResponseVacancy,
  rejectResponseVacancy,
} from '../../../shared/store/group/group.actions';
import { UserAbstractDBModel } from '../../../shared/models/backend/user_abstract.model';
import { PROFILE_PAGE, SYSTEM_MODULE } from '../../../shared/consts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-vacancy-responses',
  templateUrl: './dialog-vacancy-responses.component.html',
  styleUrls: ['./dialog-vacancy-responses.component.scss'],
})
export class DialogVacancyResponsesComponent implements OnInit {
  title = 'Отклики';
  offset = 0;
  responses: VacancyResponseModel[] = [];

  assignBtn = {
    icon: 'done',
    title: 'Одобрить',
    actions: (res: VacancyResponseModel) => this.approve(res),
  };
  leaveBtn = {
    icon: 'swipe_left',
    title: 'Отклонить',
    actions: (res: VacancyResponseModel) => this.reject(res),
  };
  partSublock = {
    menu: {
      icon: MORE_VERT_ICON,
      btns: [this.assignBtn, this.leaveBtn],
    },
  };

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private store: Store,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<DialogVacancyResponsesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogVacancyResponsesData
  ) {}

  ngOnInit() {
    this.groupService
      .GetResponses(this.data.vacancy.id, this.offset)
      .subscribe((res) => {
        if (res.offset) this.offset = res.offset;
        this.responses = res.items;
      });
  }

  getStatus(is_approved: boolean | null) {
    if (is_approved == null) return 'на рассмотрение';
    else if (is_approved) return 'одобрен';
    else return 'отклонен';
  }

  getColor(is_approved: boolean | null) {
    if (is_approved == null) return { color: 'blue' };
    return { color: is_approved ? 'green' : 'red' };
  }

  urlAvatar(avatar?: AvatarModel | null) {
    return compileURLImg(avatar ? avatar.url : null, DEFAULT_AVA);
  }

  goToUser(user: UserAbstractDBModel) {
    let id = selectId(user);
    let url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
    this.router.navigate([url]);
    this.dialogRef.close();
  }

  approve(res: VacancyResponseModel) {
    let d = new ResponseApproveModel(res.vacancy_id, res.user_id);
    this.store.dispatch(approveResponseVacancy({ parametr: d }));
    res.is_approved = true;
  }

  reject(res: VacancyResponseModel) {
    let d = new ResponseApproveModel(res.vacancy_id, res.user_id);
    this.store.dispatch(rejectResponseVacancy({ parametr: d }));
    res.is_approved = false;
  }
}
