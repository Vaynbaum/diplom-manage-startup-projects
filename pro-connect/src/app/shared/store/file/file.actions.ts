import { MessageModel } from './../../models/backend/message.model';
import { createAction, props } from '@ngrx/store';
import { CommonMaterial } from '../../models/backend/activity_task.model';
import { UploadFileModel } from '../../models/backend/upload_file.model';

export const loadFile = createAction(
  '[Any Component] Load File',
  props<{ parametr: UploadFileModel }>()
);
export const loadFileSuccess = createAction(
  '[File Service] Load File Success',
  props<{ file: CommonMaterial }>()
);
export const deleteFile = createAction(
  '[Any Component] Delete File',
  props<{ parametr: any }>()
);
export const deleteFileSuccess = createAction(
  '[File Service] Delete File Success',
  props<{ message: MessageModel }>()
);
