import { createAction, props } from '@ngrx/store';
import { GetMsgsParam } from '../../services/message.service';
import { ResponseItemsModel } from '../../models/backend/response-items.model';
import { ActivityMessageModel } from '../../models/backend/act_message.model';
import { GetNotesParam } from '../../services/note.service';
import { NoteModel } from '../../models/backend/note.model';

export const getMessages = createAction(
  '[Activity Work Component] Get Messages',
  props<{ parametr: GetMsgsParam }>()
);
export const getMessagesSuccess = createAction(
  '[Message Service] Get Messages Success',
  props<{ msgs: ResponseItemsModel<ActivityMessageModel> }>()
);
export const getNotes = createAction(
  '[Header Component] Get Notes',
  props<{ parametr: GetNotesParam }>()
);
export const getNotesSuccess = createAction(
  '[Note Service] Get Notes Success',
  props<{ notes: ResponseItemsModel<NoteModel> }>()
);
