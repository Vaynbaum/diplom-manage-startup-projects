import { EventEmitter, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { factoryHandleError } from '../common.effects';
import {
  getMessages,
  getMessagesSuccess,
  getNotes,
  getNotesSuccess,
} from './message.actions';
import { catchError, exhaustMap, map, tap } from 'rxjs';
import { commonFailedShutup } from '../common.actions';
import { MessageService } from '../../services/message.service';
import { ActivityMessageModel } from '../../models/backend/act_message.model';
import { ResponseItemsModel } from '../../models/backend/response-items.model';
import { NoteService } from '../../services/note.service';
import { NoteModel } from '../../models/backend/note.model';

export let messagesGetted = new EventEmitter<
  ResponseItemsModel<ActivityMessageModel>
>();
export let notesGetted = new EventEmitter<ResponseItemsModel<NoteModel>>();
@Injectable()
export class MessageEffects {
  constructor(
    private actions$: Actions,
    private messageService: MessageService,
    private noteService: NoteService // private _snackBar: MatSnackBar, // private router: Router
  ) {}

  getMsgs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMessages),
      exhaustMap((action) => {
        return this.messageService.GetAllMessages(action.parametr).pipe(
          map((msgs) => getMessagesSuccess({ msgs })),
          catchError(
            factoryHandleError(getMessages, commonFailedShutup, action.parametr)
          )
        );
      })
    )
  );
  getMessagesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getMessagesSuccess),
        tap(({ msgs }) => {
          messagesGetted.emit(msgs);
        })
      ),
    { dispatch: false }
  );

  getNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotes),
      exhaustMap((action) => {
        return this.noteService.GetAllNotifications(action.parametr).pipe(
          map((notes) => getNotesSuccess({ notes })),
          catchError(
            factoryHandleError(getNotes, commonFailedShutup, action.parametr)
          )
        );
      })
    )
  );
  getNotesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getNotesSuccess),
        tap(({ notes }) => {
          notesGetted.emit(notes);
        })
      ),
    { dispatch: false }
  );
}
