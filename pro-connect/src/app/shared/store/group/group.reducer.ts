import {
  deleteGroupSuccess,
  loadAvatarSuccess,
  loadCoverSuccess,
  loadGroupSuccess,
} from './group.actions';
import { createReducer, on } from '@ngrx/store';
import { FullGroupModel } from '../../models/backend/group.models';
import { CommonTypeModel } from '../../models/backend/type.model';

export const groupInitialState = new FullGroupModel(
  -1,
  '',
  -1,
  -1,
  '',
  new CommonTypeModel(-1, ''),
  new Date(),
  null,
  null,
  null,
  [],
  [],
  [],
  [],
  []
);

export const groupReducer = createReducer(
  groupInitialState,
  on(loadGroupSuccess, (state, { group }) => group),
  on(loadAvatarSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.avatar = action.avatar;
    return s;
  }),
  on(loadCoverSuccess, (state, action: any) => {
    let s = structuredClone(state);
    s.decoration = action.decoration;
    return s;
  }),
  on(deleteGroupSuccess, (state) => groupInitialState)
);
