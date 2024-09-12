import { createAction, props } from '@ngrx/store';
import { MessageModel } from '../models/backend/message.model';

export const commonSuccess = createAction(
  '[Any Service] Common Success',
  props<{ message: MessageModel }>()
);
export const commonSuccessShutup = createAction(
  '[Any Service] Common Success Shutup',
  props<{ message: MessageModel }>()
);

export const commonFailed = createAction(
  '[Any Service] Common Failed',
  props<{ error: any }>()
);
export const commonFailedShutup = createAction(
  '[Any Service] Common Failed Shutup',
  props<{ error: any }>()
);
