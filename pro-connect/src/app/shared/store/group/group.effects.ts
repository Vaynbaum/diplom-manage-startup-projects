import { GROUPS_PAGE } from './../../consts';
import { Router } from '@angular/router';
import { GroupService } from './../../services/group.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import * as ACT from './group.actions';
import { factoryHandleError } from '../common.effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectId, showMessage } from '../../functions';
import { ADD_GROUP_SUCCESS, LOADED_AVATAR, LOADED_COVER } from '../../phrases';
import {
  commonFailed,
  commonFailedShutup,
  commonSuccess,
} from '../common.actions';
import { LINK_PAGE_GROUP_SHORT, SYSTEM_MODULE } from '../../consts';
import { GroupDBModel } from '../../models/backend/group.models';

export let groupAdded = new EventEmitter<any>();
export let groupsGetted = new EventEmitter<GroupDBModel[]>();

@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private groupService: GroupService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadGroup),
      exhaustMap((action) => {
        return this.groupService.GetGroupOne(action.parametr).pipe(
          map((group) => ACT.loadGroupSuccess({ group })),
          catchError(
            factoryHandleError(ACT.loadGroup, commonFailed, action.parametr)
          )
        );
      })
    )
  );

  loadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadAvatar),
      exhaustMap((action) =>
        this.groupService.LoadAvatar(action.parametr).pipe(
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
        this.groupService.LoadCover(action.parametr).pipe(
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

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateGroup),
      exhaustMap((action) =>
        this.groupService.UpdateGroup(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.updateGroup, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  subscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.subscription),
      exhaustMap((action) =>
        this.groupService.Subscription(action.parametr).pipe(
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
        this.groupService.Unsubscription(action.parametr).pipe(
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

  addRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.addRole),
      exhaustMap((action) =>
        this.groupService.AddGroupRole(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.addRole, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateRole),
      exhaustMap((action) =>
        this.groupService.UpdateGroupRole(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.updateRole, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteRole),
      exhaustMap((action) =>
        this.groupService.DeleteGroupRole(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteRole, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  assignRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.assignRole),
      exhaustMap((action) =>
        this.groupService.AssignRole(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.assignRole, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  kickUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.kickUser),
      exhaustMap((action) =>
        this.groupService.KickUser(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.kickUser, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.createGroup),
      exhaustMap((action) =>
        this.groupService.CreateGroup(action.parametr).pipe(
          map((group) => ACT.createGroupSuccess({ group })),
          catchError(
            factoryHandleError(ACT.createGroup, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  createGroupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.createGroupSuccess),
        tap(({ group }) => {
          showMessage(this._snackBar, ADD_GROUP_SUCCESS);
          let id = selectId(group);
          this.router.navigate([`${LINK_PAGE_GROUP_SHORT}/${id}`]);
          groupAdded.emit(true);
        })
      ),
    { dispatch: false }
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteGroup),
      exhaustMap((action) =>
        this.groupService.DeleteGroup(action.parametr).pipe(
          map((message) => ACT.deleteGroupSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteGroup, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  deleteGroupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.deleteGroupSuccess),
        tap(({ message }) => {
          showMessage(this._snackBar, message.message);
          this.router.navigate([`/${SYSTEM_MODULE}/${GROUPS_PAGE}`]);
        })
      ),
    { dispatch: false }
  );

  createVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.createVacancy),
      exhaustMap((action) =>
        this.groupService.CreateVacancy(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.createVacancy, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  updateVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateVacancy),
      exhaustMap((action) =>
        this.groupService.UpdateVacancy(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.updateVacancy, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  deleteVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteVacancy),
      exhaustMap((action) =>
        this.groupService.DeleteVacancy(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteVacancy, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  createResponseVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.createResponseVacancy),
      exhaustMap((action) =>
        this.groupService.CreateResponseVacancy(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.createResponseVacancy,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  approveResponseVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.approveResponseVacancy),
      exhaustMap((action) =>
        this.groupService.ApproveResponse(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.approveResponseVacancy,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  rejectResponseVacancy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.rejectResponseVacancy),
      exhaustMap((action) =>
        this.groupService.RejectResponse(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.rejectResponseVacancy,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  getMyGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.getMyGroups),
      exhaustMap((action) =>
        this.groupService.GetMyGroups().pipe(
          map((groups) => ACT.getMyGroupsSuccess({ groups })),
          catchError(factoryHandleError(ACT.getMyGroups, commonFailedShutup))
        )
      )
    )
  );

  getMyGroupsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.getMyGroupsSuccess),
        tap(({ groups }) => {
          groupsGetted.emit(groups);
        })
      ),
    { dispatch: false }
  );

  deleteVacancyResponse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteVacancyResponse),
      exhaustMap((action) =>
        this.groupService.DeleteVacancyResponse(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.deleteVacancyResponse,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  deleteInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteInvite),
      exhaustMap((action) =>
        this.groupService.DeleteInvite(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteInvite, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  putInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.putInvite),
      exhaustMap((action) =>
        this.groupService.PutInvite(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.putInvite, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  addInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.addInvite),
      exhaustMap((action) =>
        this.groupService.AddInvite(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.addInvite, commonFailed, action.parametr)
          )
        )
      )
    )
  );
}
