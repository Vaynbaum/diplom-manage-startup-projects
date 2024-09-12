import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AvatarModel } from '../../shared/models/backend/avatar.model';
import {
  commonDelete,
  getAge,
  imageToBackground,
  selectId,
} from '../../shared/functions';
import { ADD_ICON, DEFAULT_AVA, REMOVE_ICON } from '../consts';
import {
  ShortUserWithUserAbstractModel,
  UserAbstractModel,
} from '../../shared/models/backend/user_abstract.model';
import { UserService } from '../../shared/services/user.service';
import {
  ADMIN_ROLE_ID,
  NAME_REDUCER_PROFILE,
  PROFILE_PAGE,
  SYSTEM_MODULE,
} from '../../shared/consts';
import { Router } from '@angular/router';
import { profileInitialState } from '../../shared/store/profile/profile.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ACT_SUB, ACT_UNSUB } from '../phrases';
import {
  subscription,
  unsubscription,
} from '../../shared/store/profile/profile.actions';
import { anySuccess } from '../../shared/store/common.effects';
import { CityFormFieldInput, TagFormFieldInput } from '../inputs';
import { FormControl, FormGroup } from '@angular/forms';
import { CityModel } from '../../shared/models/backend/city.model';
import { OtherService } from '../../shared/services/other.service';
import { TagService } from '../../shared/services/tag.service';
import { TagModel } from '../../shared/models/backend/tag.model';
type User = {
  user: ShortUserWithUserAbstractModel;
  subBtn: any;
  canSub: boolean;
  isSub: boolean;
};
@Component({
  selector: 'app-like-mindeds',
  templateUrl: './like-mindeds.component.html',
  styleUrls: ['./like-mindeds.component.scss'],
})
export class LikeMindedsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  offset?: number = 0;
  profile: UserAbstractModel = profileInitialState;
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  subsBtns = new Map([
    [false, { title: ACT_SUB, icon: ADD_ICON, action: subscription }],
    [true, { title: ACT_UNSUB, icon: REMOVE_ICON, action: unsubscription }],
  ]);
  selectedCity?: CityModel;
  selectedTags: TagModel[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;

  form = new FormGroup({
    city: new FormControl(null),
    skill: new FormControl(null),
  });
  constructor(
    private userService: UserService,
    private tagService: TagService,
    private otherService: OtherService,
    private router: Router,
    private store: Store<{ profile: UserAbstractModel }>
  ) {}
  ngOnDestroy(): void {
    this.ps.unsubscribe();
  }

  ageSearch = {
    enable: false,
    start: 18,
    end: 35,
  };
  cityInput = new CityFormFieldInput(this.form);
  skillInput = new TagFormFieldInput(this.form);
  searchField = {
    label: 'Поиск людей',
    placeholder: 'Кого найти?',
    closeBtn: 'close',
    searchBtn: 'search',
  };

  init = false;

  searchValue = '';
  ps: any;
  ngOnInit() {
    this.ps = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      if (!this.init) {
        this.init = true;
        this.getUser();
      }
    });
    this.loadTags();
    this.loadCity();
  }

  getUser(
    substr?: string,
    city_id?: number,
    ids?: number[],
    min_age?: number,
    max_age?: number
  ) {
    this.userService
      .GetAllUsers(substr, city_id, ids, min_age, max_age)
      .subscribe(
        (users) => {
          this.users = [];
          users.items.forEach((user) => {
            let canSub = this.checkCanSub(user);
            let btn = null,
              isSub = true;
            if (canSub) {
              isSub = this.selectSubBtn(user);
              btn = this.subsBtns.get(isSub);
            }
            this.users.push({
              user: user,
              subBtn: btn,
              canSub: canSub,
              isSub: isSub,
            });
          });
          if (users.offset) this.offset = users.offset;
        },
        (err) => {
          if (err.status == 404) {
            this.offset = 0;
            this.users = [];
          }
        }
      );
  }

  checkCanSub(user: ShortUserWithUserAbstractModel) {
    if (this.profile) return this.profile.id != user.user_abstract.id;
    return true;
  }
  sub(user: User) {
    this.store.dispatch(
      user.subBtn.action({ parametr: user.user.user_abstract.id })
    );

    let sub = anySuccess.subscribe((res) => {
      sub.unsubscribe();
      user.isSub = !user.isSub;
      user.subBtn = this.subsBtns.get(user.isSub);
    });
  }
  urlAvatar(avatar?: AvatarModel | null) {
    return imageToBackground(avatar ? avatar.url : null, DEFAULT_AVA);
  }
  selectSubBtn(user: ShortUserWithUserAbstractModel) {
    if (this.profile && user.subscribers) {
      let ind = user.subscribers.findIndex(
        (item) => item.subscriber?.id == this.profile.id
      );
      return ind != undefined && ind > -1;
    }
    return true;
  }

  goToUser(user: ShortUserWithUserAbstractModel) {
    if (user) {
      let id = selectId(user.user_abstract);
      let url = `/${SYSTEM_MODULE}/${PROFILE_PAGE}/${id}`;
      this.router.navigate([url]);
    }
  }
  getAge(user: ShortUserWithUserAbstractModel) {
    return getAge(user.birthdate);
  }

  clearSearchValue() {
    this.searchValue = '';
    this.getUserAllFilter();
  }

  onKeyup() {
    this.getUserAllFilter();
  }

  onKeyupCity() {
    let v: string = this.cityInput.formControl.value;
    this.loadCity(v);
  }

  selectCity(city: CityModel) {
    this.selectedCity = city;
    this.getUserAllFilter();
  }

  loadCity(
    substr?: string,
    regionId?: number,
    limit?: number,
    offset?: number
  ) {
    this.cityInput.loadingData();
    this.otherService.GetCities(substr, regionId, limit, offset).subscribe(
      (result) => {
        this.cityInput.loadData(result.items, 'Выберите город');
      },
      (err) => {
        if (err.status == 404)
          this.cityInput.loadData([], err.error.detail, err.error.detail);
      }
    );
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
      this.getUserAllFilter();
    }
  }

  loadTags(substr?: string, ids?: number[]) {
    this.skillInput.loadingData();
    this.tagService.GetTags(substr, ids, true).subscribe(
      (tags) => {
        this.skillInput.loadData(tags, 'Выберите теги', 'Теги');
      },
      (err) => {
        if (err.status == 404) this.skillInput.loadData([], err.error.detail);
      }
    );
  }

  deleteTag(tag: TagModel) {
    commonDelete(this.selectedTags, tag);

    let ids = this.selectedTags.map((item) => item.id);
    let v: string = this.skillInput.formControl.value;
    this.loadTags(v, ids);
    this.getUserAllFilter();
  }

  getUserAllFilter() {
    let ids = this.selectedTags.map((item) => item.id);
    let min_age = undefined,
      max_age = undefined;

    if (this.ageSearch.enable) {
      min_age = this.ageSearch.start;
      max_age = this.ageSearch.end;
    }
    this.getUser(
      this.searchValue,
      this.selectedCity?.id,
      ids,
      min_age,
      max_age
    );
  }

  changeAge() {
      this.getUserAllFilter();
  }

  resetFilters() {
    this.selectedCity = undefined;
    this.cityInput.formControl.setValue(null);
    this.loadCity();

    this.ageSearch.enable = false;
    this.getUser(this.searchValue);

    this.skillInput.formControl.setValue(null);
    this.selectedTags = [];
    if (this.fruitInput) this.fruitInput.nativeElement.value = '';
    this.loadTags();
  }

  checkUser() {
    return this.profile.role_id != ADMIN_ROLE_ID;
  }
}
