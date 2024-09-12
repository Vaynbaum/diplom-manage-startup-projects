import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import * as ACT from './activity.actions';
import { factoryHandleError } from '../common.effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showMessage } from '../../functions';
import {
  ADD_ACTIVITY_SUCCESS,
  LOADED_AVATAR,
  LOADED_COVER,
} from '../../phrases';
import {
  commonFailed,
  commonFailedShutup,
  commonSuccess,
} from '../common.actions';
import {
  ACTIVITIES_PAGE,
  LINK_PAGE_ACTIVITY,
  SYSTEM_MODULE,
} from '../../consts';
import { ActivityService } from '../../services/activity.service';
import { ActivityDBModel } from '../../models/backend/activity.model';

export let activityAdded = new EventEmitter<any>();
export let activitiesGetted = new EventEmitter<ActivityDBModel[]>();

@Injectable()
export class ActivityEffects {
  constructor(
    private actions$: Actions,
    private activityService: ActivityService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadActivity),
      exhaustMap((action) => {
        return this.activityService.GetActivity(action.parametr).pipe(
          map((activity) => ACT.loadActivitySuccess({ activity })),
          catchError(
            factoryHandleError(ACT.loadActivity, commonFailed, action.parametr)
          )
        );
      })
    )
  );

  loadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.loadAvatar),
      exhaustMap((action) =>
        this.activityService.LoadAvatar(action.parametr).pipe(
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
        this.activityService.LoadCover(action.parametr).pipe(
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

  createActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.createActivity),
      exhaustMap((action) =>
        this.activityService.CreateActivity(action.parametr).pipe(
          map((activity) => ACT.createActivitySuccess({ activity })),
          catchError(
            factoryHandleError(
              ACT.createActivity,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  createActivitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.createActivitySuccess),
        tap(({ activity }) => {
          showMessage(this._snackBar, ADD_ACTIVITY_SUCCESS);
          this.router.navigate([`${LINK_PAGE_ACTIVITY}/${activity.id}`]);
          activityAdded.emit(true);
        })
      ),
    { dispatch: false }
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateActivity),
      exhaustMap((action) =>
        this.activityService.UpdateActivity(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.updateActivity,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  deleteActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteActivity),
      exhaustMap((action) =>
        this.activityService.DeleteActivity(action.parametr).pipe(
          map((message) => ACT.deleteActivitySuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.deleteActivity,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  deleteActivitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.deleteActivitySuccess),
        tap(({ message }) => {
          showMessage(this._snackBar, message.message);
          this.router.navigate([`/${SYSTEM_MODULE}/${ACTIVITIES_PAGE}`]);
        })
      ),
    { dispatch: false }
  );
  addTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.addActivityTag),
      exhaustMap((action) =>
        this.activityService.AddSkill(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.addActivityTag,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );

  deleteTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteActivityTag),
      exhaustMap((action) =>
        this.activityService.DeleteSkill(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.deleteActivityTag,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  addRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.addRequest),
      exhaustMap((action) =>
        this.activityService.AddRequest(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.addRequest, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  addInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.addInvitation),
      exhaustMap((action) =>
        this.activityService.AddInvitation(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.addInvitation, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteRequest),
      exhaustMap((action) =>
        this.activityService.DeleteRequest(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteRequest, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  deleteInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteInvitation),
      exhaustMap((action) =>
        this.activityService.DeleteInvitation(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.deleteInvitation,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  getMyActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.getMyActivities),
      exhaustMap((action) =>
        this.activityService.GetMyActivities().pipe(
          map((groups) => ACT.getMyActivitiesSuccess({ groups })),
          catchError(
            factoryHandleError(ACT.getMyActivities, commonFailedShutup)
          )
        )
      )
    )
  );

  getMyActivitiesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACT.getMyActivitiesSuccess),
        tap(({ groups }) => {
          activitiesGetted.emit(groups);
        })
      ),
    { dispatch: false }
  );
  approveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.approveRequest),
      exhaustMap((action) =>
        this.activityService.ApproveRequest(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.approveRequest,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  rejectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.rejectRequest),
      exhaustMap((action) =>
        this.activityService.RejectRequest(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.rejectRequest, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  approveInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.approveInvitation),
      exhaustMap((action) =>
        this.activityService.ApproveInvitation(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.approveInvitation,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  rejectInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.rejectInvitation),
      exhaustMap((action) =>
        this.activityService.RejectInvitation(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.rejectInvitation,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  exitGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.exitGroup),
      exhaustMap((action) =>
        this.activityService.ExitGroup(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.exitGroup, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  kickGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.kickGroup),
      exhaustMap((action) =>
        this.activityService.KickGroup(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.kickGroup, commonFailed, action.parametr)
          )
        )
      )
    )
  );

  getTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.getTasks),
      exhaustMap((action) =>
        this.activityService.GetTasks(action.parametr).pipe(
          map((tasks) => ACT.getTasksSuccess({ tasks })),
          catchError(
            factoryHandleError(
              ACT.getTasks,
              commonFailedShutup,
              action.parametr
            )
          )
        )
      )
    )
  );
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.createTask),
      exhaustMap((action) =>
        this.activityService.CreateTask(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.createTask, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.updateTask),
      exhaustMap((action) =>
        this.activityService.UpdateTask(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.updateTask, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.deleteTask),
      exhaustMap((action) =>
        this.activityService.DeleteTask(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.deleteTask, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  changeTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.changeTaskStatus),
      exhaustMap((action) =>
        this.activityService.ChangeStatus(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(
              ACT.changeTaskStatus,
              commonFailed,
              action.parametr
            )
          )
        )
      )
    )
  );
  assignTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.assignTask),
      exhaustMap((action) =>
        this.activityService.AssignTask(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.assignTask, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  unassignTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACT.unassignTask),
      exhaustMap((action) =>
        this.activityService.UnassignTask(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(ACT.unassignTask, commonFailed, action.parametr)
          )
        )
      )
    )
  );
}
