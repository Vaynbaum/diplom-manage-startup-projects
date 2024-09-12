import { CityModel } from './../models/backend/city.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import { RegionModel } from '../models/backend/city.model';
import { ContactModel } from '../models/backend/contact.model';

const URL = `${environment.BACKEND_URL}/others`;

@Injectable({
  providedIn: 'root',
})
export class OtherService {
  constructor(private httpClient: HttpClient) {}

  GetRegions(substr?: string, limit?: number, offset?: number) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.httpClient.get<ResponseItemsModel<RegionModel>>(
      `${URL}/regions/all`,
      { params: params }
    );
  }

  GetCities(
    substr?: string,
    regionId?: number,
    limit?: number,
    offset?: number
  ) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (regionId) params.region_id = regionId;
    return this.httpClient.get<ResponseItemsModel<CityModel>>(
      `${URL}/cities/all`,
      { params: params }
    );
  }

  GetContacts() {
    return this.httpClient.get<ContactModel[]>(`${URL}/contacts/all`);
  }
}
