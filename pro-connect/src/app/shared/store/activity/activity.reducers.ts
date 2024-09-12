import {
  deleteActivitySuccess,
  getTasksSuccess,
  loadActivitySuccess,
  loadAvatarSuccess,
  loadCoverSuccess,
} from './activity.actions';
import { createReducer, on } from '@ngrx/store';
import { FullActivityModel } from '../../models/backend/activity.model';
import { CommonStatusModel } from '../../models/backend/status.model';

export const activityInitialState = new FullActivityModel(
  -1,
  '',
  -1,
  -1,
  new Date(),
  null,
  null,
  '',
  Object,
  -1,
  new CommonStatusModel(-1, ''),
  null,
  [],
  [],
  []
);

export const activityReducer = createReducer(
  activityInitialState,
  on(loadActivitySuccess, (state, { activity }) => activity),
  on(loadAvatarSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.img = action.avatar;
    return s;
  }),
  on(loadCoverSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.decoration = action.decoration;
    return s;
  }),
  on(deleteActivitySuccess, (state) => activityInitialState),
  on(getTasksSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.tasks = action.tasks;
    return s;
  })
);
