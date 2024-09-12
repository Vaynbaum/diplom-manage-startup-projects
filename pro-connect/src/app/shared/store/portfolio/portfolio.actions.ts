import { createAction, props } from '@ngrx/store';
import {
  CreatePortfolioModel,
  PortfolioModel,
  UpdatePortfolioModel,
} from '../../models/backend/portfolio.model';

export const addPortfolio = createAction(
  '[Any Component] Add Portfolio',
  props<{ parametr: CreatePortfolioModel }>()
);
export const addPortfolioSuccess = createAction(
  '[Portfolio Service] Add Portfolio Success',
  props<{ portfolio: PortfolioModel }>()
);
export const updatePortfolio = createAction(
  '[Any Component] Update Portfolio',
  props<{ parametr: UpdatePortfolioModel }>()
);
export const updatePortfolioSuccess = createAction(
  '[Portfolio Service] Update Portfolio Success',
  props<{ portfolio: PortfolioModel }>()
);
export const deletePortfolio = createAction(
  '[Any Component] Delete Portfolio',
  props<{ parametr: number }>()
);
