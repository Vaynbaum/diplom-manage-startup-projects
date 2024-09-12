import { PostService } from './../../shared/services/post.service';
import * as AC from './../../shared/store/profile/profile.actions';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as SH_CN from '../../shared/consts';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import * as FN from '../../shared/functions';
import { MatDialog } from '@angular/material/dialog';
import { DialogProfileMoreComponent } from '../dialog/dialog-profile-more/dialog-profile-more.component';
import * as PH from '../phrases';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CN from '../consts';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SYSTEM_MODULE } from '../../shared/consts';
import { anyProfileLoaded } from '../../shared/store/profile/profile.effects';
import {
  UserAbstractDBModel,
  UserAbstractModel,
} from '../../shared/models/backend/user_abstract.model';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  Group2UserModel,
  GroupModel,
} from '../../shared/models/backend/group.models';
import { anySuccess } from '../../shared/store/common.effects';
import { GROUPS } from '../../shared/phrases';
import { DialogItemsMoreComponent } from '../dialog/dialog-items-more/dialog-items-more.component';
import { SubscriptionModel } from '../../shared/models/backend/subscription.model';
import { PostModel } from '../../shared/models/backend/post.model';
import { DialogPostAddComponent } from '../dialog/dialog-post-add/dialog-post-add.component';
import { PortfolioModel } from '../../shared/models/backend/portfolio.model';
import { DialogPortfolioMoreComponent } from '../dialog/dialog-portfolio-more/dialog-portfolio-more.component';
import { DialogPortfoliosMoreComponent } from '../dialog/dialog-portfolios-more/dialog-portfolios-more.component';
import { ApexChart, ApexStroke } from 'ng-apexcharts';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  radarChart: ApexChart = {
    height: 400,
    type: 'radar',
    zoom: { enabled: true },
  };
  radarSeries: any[] = [];
  activityRadarOption = {
    initLabel: false,
    initData: false,
    title: { offsetY: 20, text: 'Проекты по статусам' },
    xaxis: { categories: [] },
    chart: this.radarChart,
    dataLabels: { enabled: true },
    series: this.radarSeries,
  };

  lineChart: ApexChart = {
    height: 400,
    type: 'area',
    zoom: { enabled: true },
  };
  stroke: ApexStroke = { curve: 'smooth' };
  lineSeries: any[] = [];
  activityLineOption = {
    stroke: this.stroke,
    initData: false,
    yaxis: { min: 0, title: { text: 'Количество проектов' } },
    xaxis: { categories: [] },
    chart: this.lineChart,
    series: this.lineSeries,
    title: { offsetY: 20, text: 'Создание проектов' },
  };
  lineSeries2: any[] = [];
  activityLine2Option = {
    stroke: this.stroke,
    initData: false,
    yaxis: { min: 0, title: { text: 'Количество групп' } },
    xaxis: { categories: [] },
    chart: this.lineChart,
    series: this.lineSeries2,
    title: { offsetY: 20, text: 'Создание групп' },
  };

  columnChart: ApexChart = { height: 350, type: 'bar' };
  columnSeries: any[] = [];
  activityColumnOption = {
    initData: false,
    fill: { opacity: 1 },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    yaxis: { title: { text: 'Количество проектов' } },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: { categories: [] },
    chart: this.columnChart,
    title: { offsetY: 20, text: 'Проекты по направлениям' },
    series: this.columnSeries,
  };

  donutChart: ApexChart = { type: 'donut' };
  donutLabels: any[] = [];
  donutSeries: any[] = [];
  donutOption = {
    initData: false,
    series: this.donutSeries,
    title: { text: 'Топ-10 тегов новостей' },
    chart: this.donutChart,
    labels: this.donutLabels,
    dataLabels: { enabled: false },
    responsive: [
      {
        breakpoint: 1000,
        options: { legend: { position: 'bottom' } },
      },
    ],
    fill: { type: 'gradient' },
  };

  postOffset?: number = 0;
  posts: PostModel[] = [];
  isMyProfile: boolean = true;
  profile$: Observable<UserAbstractModel> = this.store.select(
    SH_CN.NAME_REDUCER_PROFILE
  );
  profile: UserAbstractModel = profileInitialState;
  myProfile: UserAbstractModel = profileInitialState;
  editCoverBtn = { icon: CN.IMAGE_ICON, title: PH.EDIT_COVER };
  moreBtn = { icon: CN.INFO_ICON, title: PH.MORE };
  editBtn = {
    icon: CN.EDIT_ICON,
    title: PH.EDIT_PROFILE,
    link: `/${SYSTEM_MODULE}/${SH_CN.PROFILE_EDIT_PAGE}`,
  };
  locationIcon = SH_CN.LOCATION;
  nameInputAva = CN.NAME_INPUT_AVA;
  nameInputCover = CN.NAME_INPUT_COVER;
  acceptImages = CN.ACCEPT_IMAGES;
  id: string = SH_CN.ME;
  favs = PH.SUBS;
  subs = PH.SUBERS;
  groups = GROUPS;
  portfolios = 'Достижения';
  defaulNoPhoto = CN.DEFAULT_NO_PHOTO;
  initPost = false;

  subsBtns = new Map([
    [false, { title: PH.ACT_SUB, icon: CN.ADD_ICON, action: AC.subscription }],
    [
      true,
      { title: PH.ACT_UNSUB, icon: CN.REMOVE_ICON, action: AC.unsubscription },
    ],
  ]);
  isSub = false;
  actionBtn: any = this.subsBtns.get(this.isSub);
  isNeedLoad = false;

  constructor(
    private store: Store<{ profile: UserAbstractModel }>,
    public dialog: MatDialog,
    private photoEditorService: NgxPhotoEditorService,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canAddPost() {
    return (
      this.myProfile.role_id != SH_CN.ADMIN_ROLE_ID &&
      this.myProfile.id == this.profile.id
    );
  }
  canEditPost(post: PostModel) {
    return this.myProfile.id == post.user_id;
  }
  croll() {
    setTimeout(() => window.scrollTo({ top: 0 }), 5);
  }
  subProfile: any;
  apl: any;
  ngOnDestroy(): void {
    this.subProfile.unsubscribe();
    this.apl.unsubscribe();
  }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.initPost = false;
      this.isNeedLoad = false;
      this.loadProfile(this.id);
    });

    this.apl = anyProfileLoaded.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      this.isMyProfile = this.checkProfile(this.id);
      this.croll();
      this.showBeautifulId(this.id);

      let ind = this.profile.user?.subscribers?.findIndex(
        (item) => item.subscriber?.id == this.myProfile.id
      );
      this.isSub = ind != undefined && ind > -1;
      this.actionBtn = this.subsBtns.get(this.isSub);

      if (this.profile.id != -1) {
        this.posts = [];
        this.postService
          .GetAllPosts(this.postOffset, this.profile.id)
          .subscribe(
            (res) => {
              this.postOffset = res.offset;
              this.posts = res.items;
            },
            (err) => {
              if (err.status === 404) {
                this.posts = [];
                this.postOffset = 0;
              }
            }
          );
      }
    });

    this.subProfile = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.myProfile = res;
      this.isMyProfile = this.checkProfile(this.id);
      if (this.isMyProfile) this.profile = res;
      this.croll();
      if (this.isNeedLoad) this.loadProfile(this.id);
      this.showBeautifulId(this.id);

      this.initChart();

      if (this.profile.id != -1 && !this.initPost) {
        this.posts = [];
        this.initPost = true;
        this.postService
          .GetAllPosts(this.postOffset, this.profile.id)
          .subscribe((res) => {
            this.postOffset = res.offset;
            this.posts = res.items;
          });
      }
    });
  }

  initChart() {
    if (
      this.myProfile.id != -1 &&
      this.myProfile.role_id == SH_CN.ADMIN_ROLE_ID
    ) {
      this.adminService.GetTagActivityStatistics().subscribe((res) => {
        if (!this.donutOption.initData) {
          this.donutOption.series = res.series;
          this.donutOption.labels = res.xaxis;
          this.donutOption.initData = true;
        }
      });

      this.adminService.GetActivityStatistics().subscribe((res) => {
        if (!this.activityColumnOption.initData) {
          this.activityColumnOption.series = res.series;
          (this.activityColumnOption.xaxis.categories as string[]) = res.xaxis;
          this.activityColumnOption.initData = true;
        }
      });

      this.adminService.GetStatistics().subscribe((res) => {
        if (!this.activityRadarOption.initLabel) {
          let st = res.activity.status.status;
          let s = st.map((status) => status.split('(')[0]);
          (this.activityRadarOption.xaxis.categories as string[]) = s;
          this.activityRadarOption.initLabel = true;
        }
        if (!this.activityRadarOption.initData) {
          let d: any = { name: 'Проекты', data: res.activity.status.all };
          this.radarSeries.push(d);
          d = {
            name: 'Проекты без группы',
            data: res.activity.status.no_group,
          };
          this.radarSeries.push(d);
          this.activityRadarOption.initData = true;
        }

        if (!this.activityLineOption.initData) {
          (this.activityLineOption.xaxis.categories as string[]) =
            res.activity.created.date;
          let d: any = { name: 'Проекты', data: res.activity.created.cnt };
          this.lineSeries.push(d);
          this.activityLineOption.initData = true;
        }
        if (!this.activityLine2Option.initData) {
          (this.activityLine2Option.xaxis.categories as string[]) =
            res.activity.created.date;
          let d: any = { name: 'Группы', data: res.group.created.cnt };
          this.lineSeries2.push(d);
          this.activityLine2Option.initData = true;
        }
      });
    }
  }

  loadProfile(id: string) {
    if (this.myProfile.id != -1) {
      this.isNeedLoad = false;
      if (this.checkProfile(id)) {
        this.store.dispatch(AC.loadMyProfile({ parametr: id }));
      } else {
        this.store.dispatch(AC.loadAnyProfile({ parametr: id }));
      }
    } else {
      this.isNeedLoad = true;
    }
  }

  addPost() {
    let c = structuredClone(SH_CN.CONFIG_DIALOG);
    c.maxWidth = '1000px';

    const dialogRef = this.dialog.open(DialogPostAddComponent, {
      ...c,
      data: { post: null, files: [] },
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
    FN.commonDelete(this.posts, post);
  }

  checkProfile(id: string) {
    let compId = FN.compileId(this.myProfile.id);
    let isMe = id == SH_CN.ME;
    let isMyId = id == compId;
    let isMyUname = id == this.myProfile.username;

    return isMe || isMyId || isMyUname;
  }

  subClick() {
    this.store.dispatch(this.actionBtn.action({ parametr: this.profile.id }));
    this.isSub = !this.isSub;
    this.actionBtn = this.subsBtns.get(this.isSub);
    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      this.store.dispatch(AC.loadAnyProfile({ parametr: this.id }));
    });
  }

  navigateToProfile(profile: UserAbstractModel | UserAbstractDBModel) {
    let id = FN.selectId(profile);
    let url = `${SH_CN.LINK_PAGE_PROFILE_SHORT}/${id}`;
    this.router.navigate([url]);
  }

  showBeautifulId(id: string) {
    let idIsMe = id == SH_CN.ME;
    if (idIsMe && this.profile.id != -1) {
      this.navigateToProfile(this.profile);
    }
  }

  getProfile(res: UserAbstractModel) {
    this.profile = res;
    let isMe = this.id == SH_CN.ME;
    let compId = FN.compileId(this.myProfile.id);
    let isMyId = this.id && this.id == compId;

    if ((isMe && this.profile.id != -1) || isMyId)
      this.navigateToProfile(this.profile);
  }

  urlAvatar(avatar?: AvatarModel | null, defaultAva: string = CN.DEFAULT_AVA) {
    return FN.compileURLImg(avatar ? avatar.url : null, defaultAva);
  }

  selectCover() {
    return FN.selectCover(this.profile.decoration.coverImage);
  }

  onOpenFileDialog(name: string) {
    FN.onOpenFileDialog(name);
  }

  openDialogProfileMore() {
    const dialogRef = this.dialog.open(DialogProfileMoreComponent, {
      ...SH_CN.CONFIG_DIALOG,
      data: {
        profile: this.profile,
      },
    });
  }

  fileChangeCover(event: any) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    let image = fileList[0];
    FN.showMessage(this._snackBar, PH.LOADING_COVER);
    this.store.dispatch(AC.loadCover({ parametr: image }));
  }

  fileChange(event: any) {
    this.photoEditorService
      .open(event, {
        modalMaxWidth: CN.PHOTO_EDITOR_PAGE,
        modalTitle: PH.PHOTO_ON_PAGE,
        applyBtnText: PH.APPLY_BTN_TEXT,
        closeBtnText: PH.CLOSED_BTN_TEXT,
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        if (data) {
          FN.showMessage(this._snackBar, PH.LOADING_AVATAR);
          this.store.dispatch(AC.loadAvatar({ parametr: data.file }));
        }
      });
  }

  goToAnyPage(profile?: UserAbstractModel | UserAbstractDBModel) {
    if (profile) this.navigateToProfile(profile);
  }

  goToGroup(group: GroupModel) {
    let url = `/${SYSTEM_MODULE}/${SH_CN.GROUP_PAGE}/${FN.selectId(group)}`;
    this.router.navigate([url]);
  }

  getAge() {
    return FN.getAge(this.profile.user?.birthdate);
  }

  openAllUsers(title: string, items?: SubscriptionModel[]) {
    let arr: any[] = [];
    items?.forEach((item) => {
      let u = item.favorite ? item.favorite : item.subscriber;
      if (u) {
        let id = FN.selectId(u);
        let url = `${SH_CN.LINK_PAGE_PROFILE_SHORT}/${id}`;
        let ava = this.urlAvatar(u.avatar);
        let i = { name: `${u.firstname} ${u.lastname}`, url: url, ava: ava };
        arr.push(i);
      }
    });

    this.dialog.open(DialogItemsMoreComponent, {
      ...SH_CN.CONFIG_DIALOG,
      data: {
        title: title,
        items: arr,
      },
    });
  }

  openAllGroups(title: string, items?: Group2UserModel[]) {
    let arr: any[] = [];
    items?.forEach((item) => {
      let id = FN.selectId(item.group);
      let url = `/${SYSTEM_MODULE}/${SH_CN.GROUP_PAGE}/${id}`;
      let ava = this.urlAvatar(item.group.avatar);
      let i = {
        name: item.group.name,
        url: url,
        ava: ava,
        description: item.group.type.name,
      };
      arr.push(i);
    });

    this.dialog.open(DialogItemsMoreComponent, {
      ...SH_CN.CONFIG_DIALOG,
      data: {
        title: title,
        items: arr,
      },
    });
  }

  openPortfolio(portfolio: PortfolioModel) {
    let c = structuredClone(SH_CN.CONFIG_DIALOG);
    c.maxWidth = '700px';
    this.dialog.open(DialogPortfolioMoreComponent, {
      ...c,
      data: { portfolio: portfolio },
    });
  }

  openAllPortfolios() {
    this.dialog.open(DialogPortfoliosMoreComponent, {
      ...SH_CN.CONFIG_DIALOG,
      data: {
        title: 'Достижения',
        items: this.profile.user?.portfolios,
      },
    });
  }

  checkUser() {
    return this.myProfile.role_id != SH_CN.ADMIN_ROLE_ID;
  }

  checkViewUser() {
    return this.profile.role_id != SH_CN.ADMIN_ROLE_ID;
  }
}
