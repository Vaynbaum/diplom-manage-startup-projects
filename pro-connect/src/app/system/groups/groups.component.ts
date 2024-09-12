import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GroupService } from '../../shared/services/group.service';
import { GroupModel } from '../../shared/models/backend/group.models';
import {
  commonDelete,
  imageToBackground,
  selectId,
} from '../../shared/functions';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  ADD_ICON,
  DEFAULT_NO_PHOTO,
  GROUP_ROLE_CREATER,
  REMOVE_ICON,
} from '../consts';
import {
  ADMIN_ROLE_ID,
  CONFIG_DIALOG,
  GROUP_PAGE,
  NAME_REDUCER_PROFILE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { Router } from '@angular/router';
import { ACT_SUB, ACT_UNSUB } from '../phrases';
import {
  subscription,
  unsubscription,
} from '../../shared/store/group/group.actions';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { DialogGroupAddComponent } from '../dialog/dialog-group-add/dialog-group-add.component';
import { ActivityDBModel } from '../../shared/models/backend/activity.model';
import { DialogInvationAddComponent } from '../dialog/dialog-invation-add/dialog-invation-add.component';
import { activitiesGetted } from '../../shared/store/activity/activity.effects';
import { getMyActivities } from '../../shared/store/activity/activity.actions';
import { TagFormFieldInput, TypeGroupFormFieldInput } from '../inputs';
import { TagModel } from '../../shared/models/backend/tag.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonTypeModel } from '../../shared/models/backend/type.model';
import { TagService } from '../../shared/services/tag.service';

type Group = {
  group: GroupModel;
  subBtn: any;
  canSub: boolean;
  isSub: boolean;
};

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;
  offset?: number = 0;
  myActivities: ActivityDBModel[] = [];
  selectedTags: TagModel[] = [];
  selectedType?: CommonTypeModel[];
  addBtn = { title: 'Создать группу', icon: ADD_ICON };
  searchField = {
    label: 'Поиск групп',
    placeholder: 'Какие группы искать?',
    closeBtn: 'close',
    searchBtn: 'search',
  };

  searchValue = '';
  is_vac: boolean = false;
  is_act: boolean = false;

  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);

  subsBtns = new Map([
    [false, { title: ACT_SUB, icon: ADD_ICON, action: subscription }],
    [true, { title: ACT_UNSUB, icon: REMOVE_ICON, action: unsubscription }],
  ]);
  requestBtn = { title: 'Пригласить', icon: 'request_page' };

  form = new FormGroup({
    type: new FormControl(null),
    skill: new FormControl(null),
  });

  skillInput = new TagFormFieldInput(this.form);
  typeInput = new TypeGroupFormFieldInput(this.form);

  constructor(
    private groupService: GroupService,
    private tagService: TagService,
    private router: Router,
    private store: Store<{ profile: UserAbstractModel }>,
    public dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.asg.unsubscribe();
    this.ps.unsubscribe();
  }
  asg: any;
  ps: any;
  ngOnInit() {
    this.loadType();
    this.loadTags();

    this.asg = activitiesGetted.subscribe((activities) => {
      this.myActivities = [];
      activities.forEach((activity) => {
        if (!activity.group_id) {
          this.myActivities.push(activity);
        }
      });
    });
    this.store.dispatch(getMyActivities());

    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      this.getGroups();
    });
  }

  getGroups(
    substr?: string,
    type_id?: number[],
    ids?: number[],
    is_vac: boolean = false,
    is_act: boolean = false
  ) {
    this.groupService
      .GetAllGroups(substr, type_id, ids, is_vac, is_act)
      .subscribe(
        (groups) => {
          this.groups = [];
          groups.items.forEach((group) => {
            let canSub = this.checkCanSub(group);
            let btn = null,
              isSub = true;
            if (canSub) {
              isSub = this.selectSubBtn(group);
              btn = this.subsBtns.get(isSub);
            }
            this.groups.push({
              group: group,
              subBtn: btn,
              canSub: canSub,
              isSub: isSub,
            });
          });
          if (groups.offset) this.offset = groups.offset;
        },
        (err) => {
          if (err.status == 404) {
            this.groups = [];
            this.offset = 0;
          }
        }
      );
  }

  urlAvatar(avatar?: AvatarModel | null) {
    return imageToBackground(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }

  goToGroup(group: GroupModel) {
    let url = `/${SYSTEM_MODULE}/${GROUP_PAGE}/${selectId(group)}`;
    this.router.navigate([url]);
  }

  sub(group: Group) {
    this.store.dispatch(group.subBtn.action({ parametr: group.group.id }));
    group.isSub = !group.isSub;
    group.subBtn = this.subsBtns.get(group.isSub);
  }
  canSendReq() {
    return this.myActivities.length > 0;
  }
  addGroup() {
    const dialogRef = this.dialog.open(DialogGroupAddComponent, {
      ...CONFIG_DIALOG,
      data: {},
    });
  }

  checkCanSub(group: GroupModel) {
    if (this.profile && group.users) {
      let res = group.users.filter((u) => u.user_id == this.profile.id);
      if (res.length > 0) {
        if (res[0].role_id == GROUP_ROLE_CREATER) return false;
        else return true;
      }
      return true;
    }
    return true;
  }

  selectSubBtn(group: GroupModel) {
    if (this.profile && group.users) {
      let res = group.users.filter((u) => u.user_id == this.profile.id);
      if (res.length > 0) return true;
      else return false;
    }
    return true;
  }

  addRequest(group: GroupModel) {
    const dialogRef = this.dialog.open(DialogInvationAddComponent, {
      ...CONFIG_DIALOG,
      data: { activities: this.myActivities, group_id: group.id },
    });
  }

  selectTag(tag: TagModel) {
    if (!this.selectedTags.find((t) => t.id == tag.id)) {
      this.selectedTags.push(tag);
      this.skillInput.formControl.setValue(null);
      if (this.fruitInput) this.fruitInput.nativeElement.value = '';

      let ids = this.selectedTags.map((item) => item.id);
      this.loadTags('', ids);
      this.getGroupsAllFilter();
    }
  }
  onKeyupTag() {
    let v: string = this.skillInput.formControl.value;
    let ids = this.selectedTags.map((item) => item.id);

    this.loadTags(v, ids);
  }
  deleteTag(tag: TagModel) {
    commonDelete(this.selectedTags, tag);

    let ids = this.selectedTags.map((item) => item.id);
    let v: string = this.skillInput.formControl.value;
    this.loadTags(v, ids);
    this.getGroupsAllFilter();
  }
  loadTags(substr?: string, ids?: number[]) {
    this.skillInput.loadingData();
    this.tagService.GetTags(substr, ids, false, true).subscribe(
      (tags) => {
        this.skillInput.loadData(tags, 'Выберите теги', 'Теги');
      },
      (err) => {
        if (err.status == 404) this.skillInput.loadData([], err.error.detail);
      }
    );
  }
  selectType() {
    this.selectedType = this.typeInput.formControl.value;
    this.getGroupsAllFilter();
  }
  resetFilters() {
    this.selectedType = undefined;
    this.typeInput.formControl.setValue(null);

    this.is_act = false;
    this.is_vac = false;

    this.skillInput.formControl.setValue(null);
    if (this.fruitInput) this.fruitInput.nativeElement.value = '';

    this.selectedTags = [];
    this.loadTags();

    this.getGroupsAllFilter();
  }

  loadType() {
    this.typeInput.loadingData();
    this.groupService.GetAllTypes().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }

  getGroupsAllFilter() {
    let ids = this.selectedTags.map((item) => item.id);
    let s_ids = this.selectedType?.map((item) => item.id);

    this.getGroups(this.searchValue, s_ids, ids, this.is_vac, this.is_act);
  }

  onKeyup() {
    this.getGroupsAllFilter();
  }
  clearSearchValue() {
    this.searchValue = '';
    this.getGroupsAllFilter();
  }
  changeVac() {
    this.getGroupsAllFilter();
  }
  changeAct() {
    this.getGroupsAllFilter();
  }

  checkUser() {
    return this.profile.role_id != ADMIN_ROLE_ID;
  }

  otherStatus() {
    let c = this.typeInput.formControl.value.length - 1;
    return `(+${c} ${c == 1 ? 'тип' : 'типа'})`;
  }

  displayValue(formControl: any) {
    if (formControl.value && formControl.value.length > 0)
      return formControl.value?.[0].name;
    return '';
  }
}
