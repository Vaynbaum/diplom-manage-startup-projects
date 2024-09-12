import {
  PortfolioModel,
  PortfolioType,
} from '../models/backend/portfolio.model';

export interface DialogPortfolioAddData {
  types: PortfolioType[];
  portfolio: PortfolioModel;
}
