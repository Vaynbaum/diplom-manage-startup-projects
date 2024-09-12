import { ACTIVITY_WORK_PAGE } from './../../shared/consts';
import {
  ACCEPT_IMAGES,
  DEFAULT_AVA,
  GROUP_ROLE_OBSERVER,
  IMAGE_ICON,
  INFO_ICON,
} from './../consts';
import {
  loadActivity,
  loadAvatar,
  loadCover,
} from './../../shared/store/activity/activity.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  commonDelete,
  compileURLImg,
  onOpenFileDialog,
  selectCover,
  showMessage,
} from '../../shared/functions';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  DEFAULT_NO_PHOTO,
  NAME_INPUT_AVA,
  NAME_INPUT_COVER,
  PHOTO_EDITOR_PAGE,
} from '../consts';
import {
  DirectionModel,
  FullActivityModel,
  LoadImgActivityModel,
} from '../../shared/models/backend/activity.model';
import { Store } from '@ngrx/store';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import {
  ACTIVITY_EDIT_PAGE,
  CONFIG_DIALOG,
  NAME_REDUCER_ACTIVITY,
  NAME_REDUCER_PROFILE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import {
  APPLY_BTN_TEXT,
  CLOSED_BTN_TEXT,
  EDIT_COVER,
  LOADING_AVATAR,
  LOADING_COVER,
  MORE,
  PHOTO_ON_PAGE,
} from '../phrases';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogActivityMoreComponent } from '../dialog/dialog-activity-more/dialog-activity-more.component';
import { MatDialog } from '@angular/material/dialog';
import { PostModel } from '../../shared/models/backend/post.model';
import { PostService } from '../../shared/services/post.service';
import { DialogPostAddComponent } from '../dialog/dialog-post-add/dialog-post-add.component';
import { DialogPortfoliosMoreComponent } from '../dialog/dialog-portfolios-more/dialog-portfolios-more.component';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { PortfolioModel } from '../../shared/models/backend/portfolio.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnDestroy {
  postOffset?: number = 0;
  posts: PostModel[] = [];

  nameInputAva = NAME_INPUT_AVA;
  nameInputCover = NAME_INPUT_COVER;
  acceptImages = ACCEPT_IMAGES;
  editCoverBtn = { icon: IMAGE_ICON, title: EDIT_COVER };
  canEdit = false;
  canGoWork = false;
  moreBtn = { icon: INFO_ICON, title: MORE };
  editBtn = {
    icon: 'settings',
    title: 'Настройки',
    link: `/${SYSTEM_MODULE}/${ACTIVITY_EDIT_PAGE}`,
  };
  workBtn = {
    icon: 'work',
    title: 'Рабочее место',
    link: `/${SYSTEM_MODULE}/${ACTIVITY_WORK_PAGE}`,
  };
  id = -1;
  activity?: FullActivityModel;
  activity$: Observable<FullActivityModel> = this.store.select(
    NAME_REDUCER_ACTIVITY
  );

  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private photoEditorService: NgxPhotoEditorService,
    private postService: PostService,
    private route: ActivatedRoute,
    private store: Store<{
      profile: UserAbstractModel;
      activity: FullActivityModel;
    }>
  ) {}
  subProfile: any;
  subAct: any;
  ngOnDestroy(): void {
    this.subProfile.unsubscribe();
    this.subAct.unsubscribe();
  }

  ngOnInit() {
    this.subProfile = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      this.checkCanEdit();
      this.checkCanGoWork();
    });

    this.subAct = this.activity$?.subscribe((res: FullActivityModel) => {
      this.activity = res;
      setTimeout(() => window.scrollTo({ top: 0 }), 5);
      this.checkCanEdit();
      this.checkCanGoWork();
      if (this.activity && this.activity.id != -1) {
        this.posts = [];
        this.postService
          .GetAllPosts(this.postOffset, undefined, undefined, this.activity.id)
          .subscribe((res) => {
            this.postOffset = res.offset;
            this.posts = res.items;
          });
      }
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.store.dispatch(loadActivity({ parametr: this.id }));
    });
  }
  addPost() {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '1000px';

    const dialogRef = this.dialog.open(DialogPostAddComponent, {
      ...c,
      data: { post: null, files: [], activity_id: this.activity?.id },
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
  selectCover() {
    return selectCover(this.activity?.decoration?.coverImage);
  }

  urlAvatar(avatar?: AvatarModel | null, isUser: boolean = false) {
    let defaul = isUser ? DEFAULT_AVA : DEFAULT_NO_PHOTO;
    return compileURLImg(avatar ? avatar.url : null, defaul);
  }

  onOpenFileDialog(name: string) {
    onOpenFileDialog(name);
  }

  fileChange(event: any) {
    this.photoEditorService
      .open(event, {
        modalMaxWidth: PHOTO_EDITOR_PAGE,
        modalTitle: PHOTO_ON_PAGE,
        applyBtnText: APPLY_BTN_TEXT,
        closeBtnText: CLOSED_BTN_TEXT,
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        if (data) {
          if (this.activity) {
            showMessage(this._snackBar, LOADING_AVATAR);
            let d = new LoadImgActivityModel(this.activity.id, data.file);
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
    if (this.activity) {
      showMessage(this._snackBar, LOADING_COVER);
      let d = new LoadImgActivityModel(this.activity.id, image);
      this.store.dispatch(loadCover({ parametr: d }));
    }
  }
  checkCanGoWork() {
    if (this.profile && this.activity) {
      let owner = this.activity.creater_id == this.profile.id;
      let inTeamInd = this.activity.group?.users.findIndex(
        (user) =>
          user.user_id == this.profile.id && user.role_id != GROUP_ROLE_OBSERVER
      );
      let inTeam = inTeamInd && inTeamInd > -1 ? true : false;
      this.canGoWork = owner || inTeam;
    }
  }
  canAddPost() {
    return this.profile.id == this.activity?.creater_id;
  }
  canEditPost(post: PostModel) {
    return this.profile.id == post.activity?.creater_id;
  }
  checkCanEdit() {
    if (this.profile && this.activity) {
      this.canEdit = this.activity.creater_id == this.profile.id;
    }
  }

  openDialogActivityMore() {
    this.dialog.open(DialogActivityMoreComponent, {
      ...CONFIG_DIALOG,
      data: {
        activity: this.activity,
      },
    });
  }
  goToWork() {
    this.router.navigate([this.workBtn.link], {
      queryParams: { backref: this.id },
    });
  }
  goToEdit() {
    this.router.navigate([this.editBtn.link], {
      queryParams: { backref: this.id },
    });
  }
  openPortfolio(portfolio: PortfolioModel) {
    let c = structuredClone(CONFIG_DIALOG);
    c.maxWidth = '700px';
    this.dialog.open(DialogPortfolioMoreComponent, {
      ...c,
      data: { portfolio: portfolio },
    });
  }
  nameDirection(direction: DirectionModel | undefined) {
    if (direction) return `Направлениие: ${direction?.name}`;
    return '';
  }
  openAllPortfolios() {
    this.dialog.open(DialogPortfoliosMoreComponent, {
      ...CONFIG_DIALOG,
      data: {
        title: 'Достижения',
        items: this.activity?.portfolios,
      },
    });
  }
}
