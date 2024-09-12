import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  StatisticsModel,
  ColumnActivityStatisticsModel,
} from '../models/backend/statistics.model';
const URL = `${environment.BACKEND_URL}/admin`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}
  GetStatistics() {
    return this.httpClient.get<StatisticsModel>(`${URL}/statistics/`);
  }
  GetActivityStatistics() {
    return this.httpClient.get<ColumnActivityStatisticsModel>(
      `${URL}/activity/statistics/`
    );
  }
  GetTagActivityStatistics() {
    return this.httpClient.get<ColumnActivityStatisticsModel>(
      `${URL}/tag/statistics/`
    );
  }
}
