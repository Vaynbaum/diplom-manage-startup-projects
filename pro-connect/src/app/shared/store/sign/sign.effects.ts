import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import {
  signinSuccess,
  signin,
  signup,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,
  signupSuccess,
  recoveryPassword,
  resetPassword,
  resetPasswordSuccess,
  activation,
} from './sign.actions';
import { Router } from '@angular/router';
import { LINK_PAGE_PROFILE, LINK_PAGE_SIGNIN } from '../../consts';
import { commonFailed, commonSuccess } from '../common.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showMessage } from '../../functions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  signin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signin),
      exhaustMap((action) =>
        this.authService.Signin(action.credentials).pipe(
          map((tokens) => signinSuccess({ tokens })),
          catchError((error) => of(commonFailed({ error })))
        )
      )
    )
  );

  signSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signinSuccess),
        tap(({ tokens }) => {
          this.authService.SaveTokens(tokens);
          this.router.navigate([LINK_PAGE_PROFILE], {
            queryParams: { auth: true },
          });
        })
      ),
    { dispatch: false }
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      exhaustMap((action) =>
        this.authService.Signup(action.user).pipe(
          map((message) => signupSuccess({ message })),
          catchError((error) => of(commonFailed({ error })))
        )
      )
    )
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signupSuccess),
        tap(({ message }) => {
          this.router.navigate([LINK_PAGE_SIGNIN], {
            queryParams: { message: message.message },
          });
        })
      ),
    { dispatch: false }
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshToken),
      exhaustMap((action) =>
        this.authService.RefreshToken().pipe(
          map((tokens) =>
            refreshTokenSuccess({
              tokens: tokens,
              act: action.act,
              parametr: action.parametr,
            })
          ),
          catchError((error) => of(refreshTokenFailure({ error })))
        )
      )
    )
  );

  refreshSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshTokenSuccess),
      map((action) => {
        this.authService.SaveTokens(action.tokens);
        let parametr = action.parametr;
        if (parametr) return action.act({ parametr });
        else return action.act();
      })
    )
  );
  refreshFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(refreshTokenFailure),
        tap(({ error }) => {
          this.authService.DeleteTokens();
          this.router.navigate([LINK_PAGE_SIGNIN], {
            queryParams: { authAgain: true },
          });
        })
      ),
    { dispatch: false }
  );
  recoveryPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recoveryPassword),
      exhaustMap((action) =>
        this.authService.RecoverPassword(action.email).pipe(
          map((message) => commonSuccess({ message })),
          catchError((error) => of(commonFailed({ error })))
        )
      )
    )
  );
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      exhaustMap((action) =>
        this.authService.ResetPassword(action.parametr).pipe(
          map((message) => resetPasswordSuccess({ message })),
          catchError((error) => of(commonFailed({ error })))
        )
      )
    )
  );
  activation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activation),
      exhaustMap((action) =>
        this.authService.Activation(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError((error) => of(commonFailed({ error })))
        )
      )
    )
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetPasswordSuccess),
        tap(({ message }) => {
          showMessage(this._snackBar, message.message);
          this.router.navigate([LINK_PAGE_SIGNIN]);
        })
      ),
    { dispatch: false }
  );
}
