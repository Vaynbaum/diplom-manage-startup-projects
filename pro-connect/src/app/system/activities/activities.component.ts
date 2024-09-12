import { MatDialog } from '@angular/material/dialog';
import {
  ADMIN_ROLE_ID,
  CONFIG_DIALOG,
  NAME_REDUCER_PROFILE,
} from './../../shared/consts';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ADD_ICON, DEFAULT_NO_PHOTO } from '../consts';
import {
  ActivityModel,
  DirectionModel,
} from '../../shared/models/backend/activity.model';
import { ActivityService } from '../../shared/services/activity.service';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import { commonDelete, imageToBackground } from '../../shared/functions';
import { ACTIVITY_PAGE, SYSTEM_MODULE } from '../../shared/consts';
import { Router } from '@angular/router';
import { DialogActivityAddComponent } from '../dialog/dialog-activity-add/dialog-activity-add.component';
import { DialogRequestAddComponent } from '../dialog/dialog-request-add/dialog-request-add.component';
import { GroupDBModel } from '../../shared/models/backend/group.models';
import { groupsGetted } from '../../shared/store/group/group.effects';
import { Store } from '@ngrx/store';
import { getMyGroups } from '../../shared/store/group/group.actions';
import {
  DirectionFormFieldInput,
  StatusActFormFieldInput,
  TagFormFieldInput,
} from '../inputs';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonStatusModel } from '../../shared/models/backend/status.model';
import { TagService } from '../../shared/services/tag.service';
import { TagModel } from '../../shared/models/backend/tag.model';
import { UserAbstractModel } from '../../shared/models/backend/user_abstract.model';
import { Observable } from 'rxjs';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  activities: ActivityModel[] = [];
  myGroups: GroupDBModel[] = [];
  selectedStatus?: CommonStatusModel[];
  selectedDirections?: DirectionModel[];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;
  selectedTags: TagModel[] = [];
  is_group = false;
  addBtn = { title: 'Создать проект', icon: ADD_ICON };
  searchValue = '';
  searchField = {
    label: 'Поиск проектов',
    placeholder: 'Какие проекты искать?',
    closeBtn: 'close',
    searchBtn: 'search',
  };
  requestBtn = { title: 'Отправить заявку', icon: 'request_page' };

  form = new FormGroup({
    status: new FormControl(null),
    skill: new FormControl(null),
    direction: new FormControl(null),
  });
  typeInput = new StatusActFormFieldInput(this.form);
  directionInput = new DirectionFormFieldInput(this.form);
  skillInput = new TagFormFieldInput(this.form);
  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  constructor(
    private activityService: ActivityService,
    private tagService: TagService,
    public dialog: MatDialog,
    private store: Store<{ profile: UserAbstractModel }>,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.ps.unsubscribe();
    this.gs.unsubscribe();
    this.aas.unsubscribe();
  }
  ps: any;
  gs: any;
  aas: any;
  ngOnInit() {
    this.loadTags();
    this.loadStatus();
    this.loadDirections();
    this.getActivities();
    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
    });
    this.gs = groupsGetted.subscribe((groups) => {
      this.myGroups = groups;
    });
    this.store.dispatch(getMyGroups());
  }

  addActivity() {
    const dialogRef = this.dialog.open(DialogActivityAddComponent, {
      ...CONFIG_DIALOG,
      data: {},
    });
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return imageToBackground(avatar ? avatar.url : null, DEFAULT_NO_PHOTO);
  }
  canSendReq() {
    return this.myGroups.length > 0;
  }

  goToProject(activity: ActivityModel) {
    let url = `/${SYSTEM_MODULE}/${ACTIVITY_PAGE}/${activity.id}`;
    this.router.navigate([url]);
  }

  addRequest(activity: ActivityModel) {
    const dialogRef = this.dialog.open(DialogRequestAddComponent, {
      ...CONFIG_DIALOG,
      data: { groups: this.myGroups, activity_id: activity.id },
    });
  }

  getActivities(
    substr?: string,
    type_ids?: number[],
    direction_ids?: number[],
    ids?: number[],
    is_vac: boolean = false
  ) {
    this.aas = this.activityService
      .GetAllActivities(substr, type_ids, direction_ids, ids, is_vac)
      .subscribe(
        (activities) => {
          this.activities = activities.items;
        },
        (err) => {
          if (err.status == 404) {
            this.activities = [];
          }
        }
      );
  }
  onKeyup() {
    this.getActivitiesAllFilter();
  }

  clearSearchValue() {
    this.searchValue = '';
    this.getActivitiesAllFilter();
  }
  getActivitiesAllFilter() {
    let ids = this.selectedTags.map((item) => item.id);
    let s_ids = this.selectedStatus?.map((item) => item.id);
    let d_ids = this.selectedDirections?.map((item) => item.id);
    this.getActivities(this.searchValue, s_ids, d_ids, ids, this.is_group);
  }

  selectDirections() {
    this.selectedDirections = this.directionInput.formControl.value;
    this.getActivitiesAllFilter();
  }

  selectType() {
    this.selectedStatus = this.typeInput.formControl.value;
    this.getActivitiesAllFilter();
  }
  loadTags(substr?: string, ids?: number[]) {
    this.skillInput.loadingData();
    this.tagService.GetTags(substr, ids, false, false, true).subscribe(
      (tags) => {
        this.skillInput.loadData(tags, 'Выберите теги', 'Теги');
      },
      (err) => {
        if (err.status == 404) this.skillInput.loadData([], err.error.detail);
      }
    );
  }
  resetFilters() {
    this.selectedStatus = undefined;
    this.typeInput.formControl.setValue(null);

    this.selectedDirections = undefined;
    this.directionInput.formControl.setValue(null);

    this.is_group = false;

    this.skillInput.formControl.setValue(null);
    if (this.fruitInput) this.fruitInput.nativeElement.value = '';

    this.selectedTags = [];
    this.loadTags();

    this.getActivitiesAllFilter();
  }
  deleteTag(tag: TagModel) {
    commonDelete(this.selectedTags, tag);

    let ids = this.selectedTags.map((item) => item.id);
    let v: string = this.skillInput.formControl.value;
    this.loadTags(v, ids);
    this.getActivitiesAllFilter();
  }
  changeGroup() {
    this.getActivitiesAllFilter();
  }
  onKeyupTag() {
    let v: string = this.skillInput.formControl.value;
    let ids = this.selectedTags.map((item) => item.id);

    this.loadTags(v, ids);
  }
  selectTag(tag: TagModel) {
    if (!this.selectedTags.find((t) => t.id == tag.id)) {
      this.selectedTags.push(tag);
      this.skillInput.formControl.setValue(null);
      if (this.fruitInput) this.fruitInput.nativeElement.value = '';

      let ids = this.selectedTags.map((item) => item.id);
      this.loadTags('', ids);
      this.getActivitiesAllFilter();
    }
  }

  loadDirections() {
    this.directionInput.loadingData();
    this.activityService.GetAllDirections().subscribe(
      (result) => {
        this.directionInput.loadData(result);
      },
      (err) => {}
    );
  }

  loadStatus() {
    this.typeInput.loadingData();
    this.activityService.GetAllStatuses().subscribe(
      (result) => {
        this.typeInput.loadData(result);
      },
      (err) => {}
    );
  }

  checkUser() {
    return this.profile.role_id != ADMIN_ROLE_ID;
  }

  nameDirection(direction: DirectionModel) {
    return `Направлениие: ${direction?.name}`;
  }

  otherStatus() {
    let c = this.typeInput.formControl.value.length - 1;
    return `(+${c} ${c == 1 ? 'статус' : 'статуса'})`;
  }

  otherDirection() {
    let c = this.directionInput.formControl.value.length - 1;
    return `(+${c} ${
      c == 1 ? 'направление' : c >= 5 ? 'направлений' : 'направления'
    })`;
  }
  displayValue(formControl: any) {
    if (formControl.value && formControl.value.length > 0) {
      return formControl.value?.[0].name;
    }
    return '';
  }
}
