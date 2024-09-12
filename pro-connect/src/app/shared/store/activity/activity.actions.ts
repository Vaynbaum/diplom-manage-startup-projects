import {
  ActivityCreateModel,
  ActivityDBModel,
  UpdateActivityModel,
} from './../../models/backend/activity.model';
import { createAction, props } from '@ngrx/store';
import { AvatarModel } from '../../models/backend/avatar.model';
import { DecorationModel } from '../../models/backend/decoration.model';
import {
  FullActivityModel,
  LoadImgActivityModel,
} from '../../models/backend/activity.model';
import { MessageModel } from '../../models/backend/message.model';
import {
  DeleteActivityTag,
  ShortTagCreateModel,
} from '../../models/backend/tag.model';
import { CreateRequestModel } from '../../models/backend/activity_request.model';
import {
  ActivityTaskAModel,
  AssignTaskModel,
  ChangeStatusModel,
  CreateTaskModel,
  UpdateTaskModel,
} from '../../models/backend/activity_task.model';

export const loadActivity = createAction(
  '[Activity Component] Load Activity',
  props<{ parametr: number }>()
);
export const loadActivitySuccess = createAction(
  '[Activity Component] Load Activity',
  props<{ activity: FullActivityModel }>()
);
export const loadAvatar = createAction(
  '[Activity Component] Load Avatar',
  props<{ parametr: LoadImgActivityModel }>()
);
export const loadAvatarSuccess = createAction(
  '[Activity Service] Load Avatar Success',
  props<{ avatar: AvatarModel }>()
);
export const loadCover = createAction(
  '[Activity Component] Load Cover',
  props<{ parametr: LoadImgActivityModel }>()
);
export const loadCoverSuccess = createAction(
  '[Activity Service] Load Cover Success',
  props<{ decoration: DecorationModel }>()
);
export const createActivity = createAction(
  '[Activities Component] Activity Group',
  props<{ parametr: ActivityCreateModel }>()
);
export const createActivitySuccess = createAction(
  '[Activity Service] Create Activity Success',
  props<{ activity: ActivityDBModel }>()
);
export const updateActivity = createAction(
  '[Activity Edit Component] Update Activity',
  props<{ parametr: UpdateActivityModel }>()
);
export const deleteActivity = createAction(
  '[Activity Edit Component] Delete Activity',
  props<{ parametr: number }>()
);
export const deleteActivitySuccess = createAction(
  '[Activity Service] Delete Activity Success',
  props<{ message: MessageModel }>()
);
export const deleteActivityTag = createAction(
  '[Activity Edit Component] Delete Tag',
  props<{ parametr: DeleteActivityTag }>()
);

export const addActivityTag = createAction(
  '[Activity Edit Component] Add Tag',
  props<{ parametr: ShortTagCreateModel }>()
);
export const addRequest = createAction(
  '[Dialog Request Component] Add Request',
  props<{ parametr: CreateRequestModel }>()
);
export const addInvitation = createAction(
  '[Dialog Invitation Component] Add Invitation',
  props<{ parametr: CreateRequestModel }>()
);
export const deleteRequest = createAction(
  '[Group Edit Component] Delete Request',
  props<{ parametr: CreateRequestModel }>()
);
export const deleteInvitation = createAction(
  '[Activity Edit Component] Delete Invitation',
  props<{ parametr: CreateRequestModel }>()
);
export const getMyActivities = createAction(
  '[Groups Component] Get My Activities'
);
export const getMyActivitiesSuccess = createAction(
  '[Group Service] Get My Activities Success',
  props<{ groups: ActivityDBModel[] }>()
);
export const approveRequest = createAction(
  '[Activity Edit Component] Approve Request',
  props<{ parametr: CreateRequestModel }>()
);
export const rejectRequest = createAction(
  '[Activity Edit Component] Reject Request',
  props<{ parametr: CreateRequestModel }>()
);
export const approveInvitation = createAction(
  '[Group Edit Component] Approve Invitation',
  props<{ parametr: CreateRequestModel }>()
);
export const rejectInvitation = createAction(
  '[Group Edit Component] Reject Invitation',
  props<{ parametr: CreateRequestModel }>()
);
export const exitGroup = createAction(
  '[Group Edit Component] Exit Group',
  props<{ parametr: CreateRequestModel }>()
);
export const kickGroup = createAction(
  '[Group Edit Component] Kick Group',
  props<{ parametr: CreateRequestModel }>()
);
export const getTasks = createAction(
  '[Work Activity Component] Get Tasks',
  props<{ parametr: number }>()
);
export const getTasksSuccess = createAction(
  '[Activity Service] Get Tasks Success',
  props<{ tasks: ActivityTaskAModel[] }>()
);
export const createTask = createAction(
  '[Task Work Component] Create Task',
  props<{ parametr: CreateTaskModel }>()
);
export const updateTask = createAction(
  '[Task Work Component] Update Task',
  props<{ parametr: UpdateTaskModel }>()
);
export const deleteTask = createAction(
  '[Task Work Component] Delete Task',
  props<{ parametr: number }>()
);
export const changeTaskStatus = createAction(
  '[Task Work Component] Change Status Task',
  props<{ parametr: ChangeStatusModel }>()
);
export const assignTask = createAction(
  '[Task Work Component] Assign Task',
  props<{ parametr: AssignTaskModel }>()
);
export const unassignTask = createAction(
  '[Task Work Component] Unassign Task',
  props<{ parametr: AssignTaskModel }>()
);
