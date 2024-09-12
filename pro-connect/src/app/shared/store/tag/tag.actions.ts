import { createAction, props } from '@ngrx/store';
import { TagCreateModel } from '../../models/backend/tag.model';

export const deleteTag = createAction(
  '[Profile Edit Component] Delete Tag',
  props<{ parametr: number }>()
);

export const addTag = createAction(
  '[Profile Edit Component] Add Tag',
  props<{ parametr: TagCreateModel }>()
);
