import { ACTIVITY_PAGE } from './../../shared/consts';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as SH_CNST from '../../shared/consts';
import { Store } from '@ngrx/store';
import {
  loadAvatar,
  loadCover,
  loadGroup,
  subscription,
  unsubscription,
} from '../../shared/store/group/group.actions';
import {
  commonDelete,
  compileURLImg,
  onOpenFileDialog,
  selectCover,
  selectId,
  showMessage,
} from '../../shared/functions';
import * as CNST from '../consts';
import * as PH from '../phrases';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  FullGroupModel,
  GroupUser2Model,
  LoadImgGroupModel,
} from '../../shared/models/backend/group.models';
import {
  UserAbstractDBModel,
  UserAbstractModel,
} from '../../shared/models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogGroupMoreComponent } from '../dialog/dialog-group-more/dialog-group-more.component';
import { anySuccess } from '../../shared/store/common.effects';
import { DialogItemsMoreComponent } from '../dialog/dialog-items-more/dialog-items-more.component';
import { VacancyModel } from '../../shared/models/backend/vacancy.model';
import { DialogVacanciesMoreComponent } from '../dialog/dialog-vacancies-more/dialog-vacancies-more.component';
import { DialogVacancyMoreComponent } from '../dialog/dialog-vacancy-more/dialog-vacancy-more.component';
import { ActivityModel } from '../../shared/models/backend/activity.model';
import { PostModel } from '../../shared/models/backend/post.model';
import { PostService } from '../../shared/services/post.service';
import { DialogPostAddComponent } from '../dialog/dialog-post-add/dialog-post-add.component';
import { PortfolioModel } from '../../shared/models/backend/portfolio.model';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { DialogPortfoliosMoreComponent } from '../dialog/dialog-portfolios-more/dialog-portfolios-more.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit, OnDestroy {
  postOffset?: number = 0;
  posts: PostModel[] = [];

  nameInputAva = CNST.NAME_INPUT_AVA;
  nameInputCover = CNST.NAME_INPUT_COVER;
  acceptImages = CNST.ACCEPT_IMAGES;
  editCoverBtn = { icon: CNST.IMAGE_ICON, title: PH.EDIT_COVER };
  editBtn = {
    icon: 'settings',
    title: 'Настройки',
    link: `/${SH_CNST.SYSTEM_MODULE}/${SH_CNST.GROUP_EDIT_PAGE}`,
  };
  moreBtn = { icon: CNST.INFO_ICON, title: PH.MORE };
  users = PH.PARTS;
  activities = 'Проекты';
  canEdit = false;
  canSub = true;
  subsBtns = new Map([
    [false, { title: PH.ACT_SUB, icon: CNST.ADD_ICON, action: subscription }],
    [
      true,
      { title: PH.ACT_UNSUB, icon: CNST.REMOVE_ICON, action: unsubscription },
    ],
  ]);
  isSub = false;
  actionBtn: any = this.subsBtns.get(this.isSub);
  id = '';

  vacancies = 'Вакансии';

  group?: FullGroupModel;
  group$: Observable<FullGroupModel> = this.store.select(
    SH_CNST.NAME_REDUCER_GROUP
  );
  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> = this.store.select(
    SH_CNST.NAME_REDUCER_PROFILE
  );

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private photoEditorService: NgxPhotoEditorService,
    private store: Store<{ profile: UserAbstractModel; group: FullGroupModel }>,
    private postService: PostService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  subProfile: any;
  subGroup: any;
  ngOnDestroy(): void {
    this.subProfile.unsubscribe();
    this.subGroup.unsubscribe();
  }
  ngOnInit() {
    this.subProfile = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      this.checkCanEdit();
      this.checkCanSub();
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.store.dispatch(loadGroup({ parametr: this.id }));
    });

    this.subGroup = this.group$?.subscribe((res: FullGroupModel) => {
      this.group = res;
      setTimeout(() => window.scrollTo({ top: 0 }), 5);
      this.checkCanEdit();
      this.checkCanSub();
      if (this.group && this.group.id != -1) {
        this.posts = [];
        this.postService
          .GetAllPosts(this.postOffset, undefined, this.group.id)
          .subscribe((res) => {
            this.postOffset = res.offset;
            this.posts = res.items;
          });
      }
    });
  }

  goToEdit() {
    this.router.navigate([this.editBtn.link], {
      queryParams: { backref: this.id },
    });
  }

  checkCanSub() {
    if (this.profile && this.group) {
      let res = this.group.users.filter((u) => u.user.id == this.profile.id);
      if (res.length > 0) {
        if (res[0].role.id == CNST.GROUP_ROLE_CREATER) {
          this.canSub = false;
        } else {
          this.canSub = true;
        }
        this.isSub = true;
      } else {
        this.isSub = false;
      }
      this.actionBtn = this.subsBtns.get(this.isSub);
    }
  }

  checkCanEdit() {
    if (this.profile && this.group) {
      let res = this.group.users.filter((u) => u.user.id == this.profile.id);
      if (res.length > 0) {
        let ind = CNST.ADMIN_GROUP_ROLES.find((r) => r == res[0].role.id);
        if (ind && ind > -1) this.canEdit = true;
        else this.canEdit = false;
      } else this.canEdit = false;
    }
  }

  fileChange(event: any) {
    this.photoEditorService
      .open(event, {
        modalMaxWidth: CNST.PHOTO_EDITOR_PAGE,
        modalTitle: PH.PHOTO_ON_PAGE,
        applyBtnText: PH.APPLY_BTN_TEXT,
        closeBtnText: PH.CLOSED_BTN_TEXT,
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        if (data) {
          if (this.group) {
            showMessage(this._snackBar, PH.LOADING_AVATAR);
            let d = new LoadImgGroupModel(this.group.id, data.file);
            this.store.dispatch(loadAvatar({ parametr: d }));
          }
        }
      });
  }

  fileChangeCover(event: any) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    let image = fileList[0];
    if (this.group) {
      showMessage(this._snackBar, PH.LOADING_COVER);
      let d = new LoadImgGroupModel(this.group.id, image);
      this.store.dispatch(loadCover({ parametr: d }));
    }
  }

  onOpenFileDialog(name: string) {
    onOpenFileDialog(name);
  }

  selectCover() {
    return selectCover(this.group?.decoration?.coverImage);
  }

  urlAvatar(avatar?: AvatarModel | null, isUser: boolean = false) {
    let defaultAvatar = isUser ? CNST.DEFAULT_AVA : CNST.DEFAULT_NO_PHOTO;
    return compileURLImg(avatar ? avatar.url : null, defaultAvatar);
  }
  canAddPost() {
    return this.profile.id == this.group?.creater_id;
  }
  canEditPost(post: PostModel) {
    return this.profile.id == post.group?.creater_id;
  }
  addPost() {
    let c = structuredClone(SH_CNST.CONFIG_DIALOG);
    c.maxWidth = '1000px';

    const dialogRef = this.dialog.open(DialogPostAddComponent, {
      ...c,
      data: { post: null, files: [], group_id: this.group?.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result = structuredClone(result);
        result.likes = [];
        this.posts.unshift(result);
      }
    });
  }
  postDeleted(post: PostModel) {
    commonDelete(this.posts, post);
  }
  openDialogGroupMore() {
    const dialogRef = this.dialog.open(DialogGroupMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        group: this.group,
      },
    });
  }

  goToUser(user: UserAbstractDBModel) {
    if (user) {
      let id = selectId(user);
      let url = `/${SH_CNST.SYSTEM_MODULE}/${SH_CNST.PROFILE_PAGE}/${id}`;
      this.router.navigate([url]);
    }
  }

  subClick() {
    this.store.dispatch(this.actionBtn.action({ parametr: this.group?.id }));
    this.isSub = !this.isSub;
    this.actionBtn = this.subsBtns.get(this.isSub);

    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(loadGroup({ parametr: this.id }));
    });
  }

  openAllVacs(title: string, items?: VacancyModel[]) {
    this.dialog.open(DialogVacanciesMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        title: title,
        items: items,
      },
    });
  }

  openVacancy(vacancy: VacancyModel) {
    this.dialog.open(DialogVacancyMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        vacancy: vacancy,
      },
    });
  }

  openAllUsers(title: string, items?: GroupUser2Model[]) {
    let arr: any[] = [];
    items?.forEach((item) => {
      let id = selectId(item.user);
      let url = `${SH_CNST.LINK_PAGE_PROFILE_SHORT}/${id}`;
      let ava = this.urlAvatar(item.user.avatar, true);
      let i = {
        name: `${item.user.firstname} ${item.user.lastname}`,
        url: url,
        ava: ava,
        description: item.role.name,
      };
      arr.push(i);
    });

    this.dialog.open(DialogItemsMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        title: title,
        items: arr,
      },
    });
  }

  lenVac() {
    return this.group?.vacancies.filter((i) => i.is_active).length;
  }

  goToProject(activity: ActivityModel) {
    let url = `/${SH_CNST.SYSTEM_MODULE}/${ACTIVITY_PAGE}/${activity.id}`;
    this.router.navigate([url]);
  }

  openAllActs(title: string, items?: ActivityModel[]) {
    let arr: any[] = [];
    items?.forEach((item) => {
      let url = `/${SH_CNST.SYSTEM_MODULE}/${ACTIVITY_PAGE}/${item.id}`;
      let ava = this.urlAvatar(item.img);
      let i = {
        name: item.name,
        url: url,
        ava: ava,
        description: item.status.name,
      };
      arr.push(i);
    });

    this.dialog.open(DialogItemsMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        title: title,
        items: arr,
      },
    });
  }
  openPortfolio(portfolio: PortfolioModel) {
    let c = structuredClone(SH_CNST.CONFIG_DIALOG);
    c.maxWidth = '700px';
    this.dialog.open(DialogPortfolioMoreComponent, {
      ...c,
      data: { portfolio: portfolio },
    });
  }
  openAllPortfolios() {
    this.dialog.open(DialogPortfoliosMoreComponent, {
      ...SH_CNST.CONFIG_DIALOG,
      data: {
        title: 'Достижения',
        items: this.group?.portfolios,
      },
    });
  }

  checkUser() {
    return this.profile.role_id != SH_CNST.ADMIN_ROLE_ID;
  }
}
