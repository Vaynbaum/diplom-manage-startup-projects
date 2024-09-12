import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreatePortfolioModel,
  PortfolioModel,
  PortfolioType,
  UpdatePortfolioModel,
} from '../models/backend/portfolio.model';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/backend/message.model';
const URL = `${environment.BACKEND_URL}/portfolios`;

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private httpClient: HttpClient) {}
  GetAllTypes() {
    return this.httpClient.get<PortfolioType[]>(`${URL}/types/all`);
  }

  CreatePortfolio(data: CreatePortfolioModel) {
    return this.httpClient.post<PortfolioModel>(`${URL}/`, data);
  }
  UpdatePortfolio(data: UpdatePortfolioModel) {
    return this.httpClient.put<PortfolioModel>(`${URL}/`, data);
  }
  DeletePortfolio(id: number) {
    return this.httpClient.delete<MessageModel>(`${URL}/`, {
      params: { id: id },
    });
  }
}
