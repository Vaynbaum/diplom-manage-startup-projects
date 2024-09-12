import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PortfolioService } from '../../services/portfolio.service';
import {
  addPortfolio,
  addPortfolioSuccess,
  deletePortfolio,
  updatePortfolio,
  updatePortfolioSuccess,
} from './portfolio.actions';
import { catchError, exhaustMap, map, tap } from 'rxjs';
import { anySuccess, factoryHandleError } from '../common.effects';
import { commonFailed, commonSuccess } from '../common.actions';

@Injectable()
export class PortfolioEffects {
  constructor(
    private actions$: Actions,
    private portfolioService: PortfolioService
  ) {}

  addPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPortfolio),
      exhaustMap((action) =>
        this.portfolioService.CreatePortfolio(action.parametr).pipe(
          map((portfolio) => addPortfolioSuccess({ portfolio })),
          catchError(
            factoryHandleError(addPortfolio, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  addPortfolioSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addPortfolioSuccess),
        tap(({ portfolio }) => {
          anySuccess.emit(portfolio);
        })
      ),
    { dispatch: false }
  );

  updatePortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePortfolio),
      exhaustMap((action) =>
        this.portfolioService.UpdatePortfolio(action.parametr).pipe(
          map((portfolio) => updatePortfolioSuccess({ portfolio })),
          catchError(
            factoryHandleError(updatePortfolio, commonFailed, action.parametr)
          )
        )
      )
    )
  );
  updatePortfolioSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updatePortfolioSuccess),
        tap(({ portfolio }) => {
          anySuccess.emit(portfolio);
        })
      ),
    { dispatch: false }
  );
  deletePortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePortfolio),
      exhaustMap((action) =>
        this.portfolioService.DeletePortfolio(action.parametr).pipe(
          map((message) => commonSuccess({ message })),
          catchError(
            factoryHandleError(deletePortfolio, commonFailed, action.parametr)
          )
        )
      )
    )
  );
}
