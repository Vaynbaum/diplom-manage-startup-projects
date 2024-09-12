import { DELETED_FILE, LOADED_FILE } from './../../phrases';
import { EventEmitter, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { factoryHandleError } from '../common.effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showMessage } from '../../functions';
import { commonFailed } from '../common.actions';
import { FileService } from '../../services/file.service';
import {
  deleteFile,
  deleteFileSuccess,
  loadFile,
  loadFileSuccess,
} from './file.actions';
import { CommonMaterial } from '../../models/backend/activity_task.model';

export let fileUloaded = new EventEmitter<CommonMaterial>();
export let fileDeleted = new EventEmitter<boolean>();

@Injectable()
export class FileEffects {
  constructor(
    private actions$: Actions,
    private fileService: FileService,
    private _snackBar: MatSnackBar
  ) {}

  loadFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFile),
      exhaustMap((action) =>
        this.fileService.UploadFile(action.parametr).pipe(
          map((file) => loadFileSuccess({ file })),
          catchError(
            factoryHandleError(loadFile, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  loadFileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadFileSuccess),
        tap((action) => {
          showMessage(this._snackBar, LOADED_FILE);
          fileUloaded.emit(action.file);
        })
      ),
    { dispatch: false }
  );

  deleteFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFile),
      exhaustMap((action) =>
        this.fileService.DeleteFile(action.parametr).pipe(
          map((message) => deleteFileSuccess({ message })),
          catchError(
            factoryHandleError(deleteFile, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  deleteFileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteFileSuccess),
        tap((action) => {
          showMessage(this._snackBar, DELETED_FILE);
          fileDeleted.emit(true);
        })
      ),
    { dispatch: false }
  );
}
