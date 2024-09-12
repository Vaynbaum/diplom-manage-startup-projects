import { EventEmitter, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { refreshToken } from './sign/sign.actions';
import { showError, showMessage } from '../functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import {
  commonFailed,
  commonFailedShutup,
  commonSuccess,
  commonSuccessShutup,
} from './common.actions';

export let anySuccess = new EventEmitter<any>();

@Injectable()
export class ErrorShowEffects {
  show$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(commonFailed),
        tap(({ error }) => showError(error, this._snackBar))
      ),
    { dispatch: false }
  );

  showShutup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(commonFailedShutup),
        tap(({ error }) => {})
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private _snackBar: MatSnackBar) {}
}

@Injectable()
export class SuccessShowEffects {
  show$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(commonSuccess),
        tap(({ message }) => {
          showMessage(this._snackBar, message.message);
          anySuccess.emit(true);
        })
      ),
    { dispatch: false }
  );

  showShutup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(commonSuccessShutup),
        tap(({ message }) => {
          anySuccess.emit(true);
        })
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private _snackBar: MatSnackBar) {}
}

export const factoryHandleError = (
  action: Function,
  defaultAction: Function,
  parametr?: any
) => {
  return (error: any) => {
    if (error instanceof HttpErrorResponse) {
      const status = error.status;
      if (status === 401) {
        return of(refreshToken({ act: action, parametr: parametr }));
      }
    }
    return of(defaultAction({ error }));
  };
};
