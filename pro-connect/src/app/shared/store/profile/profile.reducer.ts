import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../../models/backend/user.model';
import { RoleModel } from '../../models/backend/role.model';
import {
  loadAvatarSuccess,
  loadCoverSuccess,
  loadMyProfileSuccess,
  logout,
} from './profile.actions';
import { ShortCityModel } from '../../models/backend/city.model';
import { P_ENTER_EMAIL, P_ENTER_FNAME, P_ENTER_LNAME } from '../../phrases';
import { P_ENTER_UNAME } from '../../../system/phrases';
import { DecorationModel } from '../../models/backend/decoration.model';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';
import { AdminModel } from '../../models/backend/admin.model';
import { AvatarModel } from '../../models/backend/avatar.model';

export const profileInitialState = new UserAbstractModel(
  -1,
  P_ENTER_EMAIL,
  P_ENTER_FNAME,
  P_ENTER_LNAME,
  P_ENTER_UNAME,
  -1,
  new DecorationModel(null),
  new AvatarModel(null, null),
  new Date(),

  new RoleModel(-1, ''),
  new UserModel(new Date().toString(), new ShortCityModel(-1, '', -1)),
  new AdminModel(false)
);

export const profileReducer = createReducer(
  profileInitialState,
  on(logout, (state) => profileInitialState),
  on(loadMyProfileSuccess, (state, { profile }) => profile),
  on(loadAvatarSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.avatar = action.avatar;
    return s;
  }),
  on(loadCoverSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.decoration = action.decoration;
    return s;
  })
);
