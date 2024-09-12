import { createAction, props } from '@ngrx/store';

export const resizeWindow = createAction(
  '[System Component] Resize Window',
  props<{ event: any }>()
);
