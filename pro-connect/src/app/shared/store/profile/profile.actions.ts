import { createAction, props } from '@ngrx/store';
import { UpdateUserModel } from '../../models/backend/user.model';
import { DecorationModel } from '../../models/backend/decoration.model';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';
import { AvatarModel } from '../../models/backend/avatar.model';
import { MessageModel } from '../../models/backend/message.model';

export const loadMyProfile = createAction(
  '[Profile Component] Load Profile',
  props<{ parametr?: string }>()
);
export const loadMyProfileSuccess = createAction(
  '[User Service] Load Profile Success',
  props<{ profile: UserAbstractModel }>()
);
export const logout = createAction('[Header Component] Logout');

export const loadAnyProfile = createAction(
  '[Profile Component] Load Any Profile',
  props<{ parametr?: string }>()
);
export const loadAnyProfileSuccess = createAction(
  '[User Service] Load Profile Any Success',
  props<{ profile: UserAbstractModel }>()
);

export const updateProfile = createAction(
  '[Profile Edit Component] Update Profile',
  props<{ parametr: UpdateUserModel }>()
);

export const loadAvatar = createAction(
  '[Profile Component] Load Avatar',
  props<{ parametr: any }>()
);
export const loadAvatarSuccess = createAction(
  '[User Service] Load Avatar Success',
  props<{ avatar: AvatarModel }>()
);

export const loadCover = createAction(
  '[Profile Component] Load Cover',
  props<{ parametr: any }>()
);
export const loadCoverSuccess = createAction(
  '[User Service] Load Cover Success',
  props<{ decoration: DecorationModel }>()
);

export const subscription = createAction(
  '[Profile Component] Subscription',
  props<{ parametr: number }>()
);

export const unsubscription = createAction(
  '[Profile Component] Unsubscription',
  props<{ parametr: number }>()
);
export const resetEmail = createAction(
  '[Profile Edit Component] Reset Email',
  props<{ parametr: string }>()
);
export const resetPassword = createAction(
  '[Profile Edit Component] Reset Password',
  props<{ parametr: string }>()
);
export const deleteUser = createAction(
  '[Profile Edit Component] Delete Profile'
);
export const deleteUserSuccess = createAction(
  '[User Service] Delete Profile Success',
  props<{ message: MessageModel }>()
);
