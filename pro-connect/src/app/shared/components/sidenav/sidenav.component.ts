import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  LINK_PAGE_PROFILE_SHORT,
  MENU_LINKS,
  NAME_REDUCER_PROFILE,
} from '../../consts';
import { profileInitialState } from '../../store/profile/profile.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectId } from '../../functions';
import { loadMyProfile } from '../../store/profile/profile.actions';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavMapComponent implements OnInit, OnDestroy {
  profile$: Observable<UserAbstractModel> =
    this.store.select(NAME_REDUCER_PROFILE);
  profile: UserAbstractModel = profileInitialState;

  constructor(private store: Store<{ profile: UserAbstractModel }>) {}
  ngOnDestroy(): void {
    this.ss.unsubscribe();
  }
  ss: any;
  ngOnInit() {
    this.store.dispatch(loadMyProfile({}));
    this.ss = this.profile$?.subscribe((res: UserAbstractModel) => {
      this.profile = res;
      this.links[0].link = `${LINK_PAGE_PROFILE_SHORT}/${selectId(res)}`;
    });
  }

  links = MENU_LINKS;

  drawerColor(flag: boolean) {
    if (flag) {
      return {
        'background-color': 'rgb(224, 224, 224)',
        'border-radius': '5px',
      };
    }
    return {};
  }
}
