import { TagService } from './../../services/tag.service';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { factoryHandleError } from '../common.effects';
import { addTag, deleteTag } from './tag.actions';
import { commonFailed, commonSuccess } from '../common.actions';

@Injectable()
export class SkillEffects {
  constructor(private actions$: Actions, private tagService: TagService) {}
  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTag),
      exhaustMap((action) =>
        this.tagService.AddSkill(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(factoryHandleError(addTag, commonFailed, action.parametr))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTag),
      exhaustMap((action) =>
        this.tagService.DeleteSkill(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(deleteTag, commonFailed, action.parametr)
          )
        )
      )
    )
  );
}
