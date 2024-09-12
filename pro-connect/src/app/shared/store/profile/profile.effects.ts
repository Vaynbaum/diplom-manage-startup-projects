import { EventEmitter, Injectable, Output } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as ACT from './profile.actions';
import { factoryHandleError } from '../common.effects';
import { showMessage } from '../../functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOADED_AVATAR, LOADED_COVER } from '../../phrases';
import { commonFailed, commonSuccess } from '../common.actions';
import { UserAbstractModel } from '../../models/backend/user_abstract.model';
import { Store } from '@ngrx/store';
import { LINK_PAGE_SIGNIN } from '../../consts';
import { Router } from '@angular/router';
export let anyProfileLoaded = new EventEmitter<UserAbstractModel>();

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private store: Store
  ) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadMyProfile),
      exhaustMap((action) => {
        return this.userService.GetUserProfile(action.parametr).pipe(
          map((profile) => ACT.loadMyProfileSuccess({ profile })),
          catchError(
            factoryHandleError(ACT.loadMyProfile, commonFailed, action.parametr)
          )
        );
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateProfile),
      exhaustMap((action) =>
        this.userService.UpdateUser(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.updateProfile, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  loadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadAvatar),
      exhaustMap((action) =>
        this.userService.LoadAvatar(action.parametr).pipe(
          map((avatar) => ACT.loadAvatarSuccess({ avatar })),
          catchError(
            factoryHandleError(ACT.loadAvatar, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  loadAvatarSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.loadAvatarSuccess),
        tap(() => {
          showMessage(this._snackBar, LOADED_AVATAR);
        })
      ),
    { dispatch: false }
  );

  loadCover$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadCover),
      exhaustMap((action) =>
        this.userService.LoadCover(action.parametr).pipe(
          map((decoration) => ACT.loadCoverSuccess({ decoration })),
          catchError(
            factoryHandleError(ACT.loadCover, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  loadCoverSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.loadCoverSuccess),
        tap(() => {
          showMessage(this._snackBar, LOADED_COVER);
        })
      ),
    { dispatch: false }
  );

  loadAnyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadAnyProfile),
      exhaustMap((action) => {
        return this.userService.GetUserProfile(action.parametr).pipe(
          map((profile) => ACT.loadAnyProfileSuccess({ profile })),
          catchError(
            factoryHandleError(
              ACT.loadAnyProfile,
              commonFailed,
              action.parametr
            )
          )
        );
      })
    )
  );

  loadAnyProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.loadAnyProfileSuccess),
        tap((action) => {
          anyProfileLoaded.emit(action.profile);
        })
      ),
    { dispatch: false }
  );

  subscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.subscription),
      exhaustMap((action) =>
        this.userService.Subscription(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.subscription, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  unsubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.unsubscription),
      exhaustMap((action) =>
        this.userService.Unsubscription(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.unsubscription,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  resetEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.resetEmail),
      exhaustMap((action) =>
        this.userService.ResetEmail(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.resetEmail, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.resetPassword),
      exhaustMap((action) =>
        this.userService.ResetPassword(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.resetPassword, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteUser),
      exhaustMap(() =>
        this.userService.DeleteUser().pipe(
          map((message) => ACT.deleteUserSuccess({ message })),
          catchError(factoryHandleError(ACT.deleteUser, commonFailed))
        )
      )
    )
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.deleteUserSuccess),
        tap(({ message }) => {
          showMessage(this._snackBar, message.message);
          this.store.dispatch(ACT.logout());
          this.router.navigate([LINK_PAGE_SIGNIN]);
        })
      ),
    { dispatch: false }
  );

  // deleteUserSuccess$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(ACT.deleteUserSuccess),
  //       tap(({ message }) => {

  //         showMessage(this._snackBar, message.message);
  //       })
  //     ),
  //   { dispatch: false }
  // );
}
