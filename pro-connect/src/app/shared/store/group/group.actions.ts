import {
  AddGroupRoleModel,
  GroupCreateModel,
  GroupDBModel,
  GroupRoleAssignModel,
  KickGroupUserModel,
  LoadImgGroupModel,
  UpdateGroupModel,
  UpdateGroupRoleModel,
} from './../../models/backend/group.models';
import { createAction, props } from '@ngrx/store';
import { FullGroupModel } from '../../models/backend/group.models';
import { AvatarModel } from '../../models/backend/avatar.model';
import { DecorationModel } from '../../models/backend/decoration.model';
import { MessageModel } from '../../models/backend/message.model';
import {
  CreateVacancyModel,
  UpdateVacancyModel,
} from '../../models/backend/vacancy.model';
import { ResponseApproveModel } from '../../models/backend/vacancy_response.model';
import {
  CreateIviteModel,
  ResponseInviteModel,
} from '../../models/backend/response_invite.model';

export const loadGroup = createAction(
  '[Group Component] Load Group',
  props<{ parametr: string }>()
);
export const loadGroupSuccess = createAction(
  '[Group Service] Load Group Success',
  props<{ group: FullGroupModel }>()
);
export const loadAvatar = createAction(
  '[Group Component] Load Avatar',
  props<{ parametr: LoadImgGroupModel }>()
);
export const loadAvatarSuccess = createAction(
  '[Group Service] Load Avatar Success',
  props<{ avatar: AvatarModel }>()
);
export const loadCover = createAction(
  '[Group Component] Load Cover',
  props<{ parametr: LoadImgGroupModel }>()
);
export const loadCoverSuccess = createAction(
  '[Group Service] Load Cover Success',
  props<{ decoration: DecorationModel }>()
);
export const updateGroup = createAction(
  '[Group Edit Component] Update Group',
  props<{ parametr: UpdateGroupModel }>()
);
export const subscription = createAction(
  '[Group Component] Subscription',
  props<{ parametr: number }>()
);
export const unsubscription = createAction(
  '[Group Component] Unsubscription',
  props<{ parametr: number }>()
);
export const addRole = createAction(
  '[Group Edit Component] Add Role',
  props<{ parametr: AddGroupRoleModel }>()
);
export const updateRole = createAction(
  '[Group Edit Component] Update Role',
  props<{ parametr: UpdateGroupRoleModel }>()
);
export const deleteRole = createAction(
  '[Group Edit Component] Delete Role',
  props<{ parametr: number }>()
);
export const assignRole = createAction(
  '[Group Edit Component] Assign Role',
  props<{ parametr: GroupRoleAssignModel }>()
);
export const kickUser = createAction(
  '[Group Edit Component] Kick User',
  props<{ parametr: KickGroupUserModel }>()
);
export const createGroup = createAction(
  '[Groups Component] Create Group',
  props<{ parametr: GroupCreateModel }>()
);
export const createGroupSuccess = createAction(
  '[Group Service] Create Group Success',
  props<{ group: GroupDBModel }>()
);
export const deleteGroup = createAction(
  '[Group Edit Component] Delete Group',
  props<{ parametr: number }>()
);
export const deleteGroupSuccess = createAction(
  '[Group Service] Delete Group Success',
  props<{ message: MessageModel }>()
);
export const createVacancy = createAction(
  '[Group Edit Component] Create Vacancy',
  props<{ parametr: CreateVacancyModel }>()
);
export const updateVacancy = createAction(
  '[Group Edit Component] Update Vacancy',
  props<{ parametr: UpdateVacancyModel }>()
);
export const deleteVacancy = createAction(
  '[Group Edit Component] Delete Vacancy',
  props<{ parametr: number }>()
);
export const createResponseVacancy = createAction(
  '[Group Component] Create Response Vacancy',
  props<{ parametr: number }>()
);
export const approveResponseVacancy = createAction(
  '[Group Edit Component] Approve Response Vacancy',
  props<{ parametr: ResponseApproveModel }>()
);
export const rejectResponseVacancy = createAction(
  '[Group Edit Component] Reject Response Vacancy',
  props<{ parametr: ResponseApproveModel }>()
);
export const getMyGroups = createAction('[Activities Component] Get My Groups');
export const getMyGroupsSuccess = createAction(
  '[Group Service] Get My Groups Success',
  props<{ groups: GroupDBModel[] }>()
);
export const deleteVacancyResponse = createAction(
  '[User Component] Delete Response Vacancy',
  props<{ parametr: number }>()
);
export const deleteInvite = createAction(
  '[User Component] Delete Invite',
  props<{ parametr: number }>()
);
export const putInvite = createAction(
  '[User Component] Put Invite',
  props<{ parametr: ResponseInviteModel }>()
);
export const addInvite = createAction(
  '[User Component] Add Invite',
  props<{ parametr: CreateIviteModel }>()
);
