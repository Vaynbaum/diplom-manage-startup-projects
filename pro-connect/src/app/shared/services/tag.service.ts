import { Injectable } from '@angular/core';
import {
  TagCreateModel,
  TagLevelModel,
  TagModel,
} from '../models/backend/tag.model';
import { HttpClient } from '@angular/common/http';
import { MessageModel } from '../models/backend/message.model';
import { environment } from '../../../environments/environment';
const URL = `${environment.BACKEND_URL}/tags`;

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private httpClient: HttpClient) {}

  GetLevels() {
    return this.httpClient.get<TagLevelModel[]>(`${URL}/levels/all`);
  }

  GetTags(
    substr?: string,
    ids?: number[],
    to_user?: boolean,
    to_group?: boolean,
    to_activity?: boolean,
    limit?: number,
    offset?: number
  ) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (to_user) params.to_user = to_user;
    if (to_group) params.to_group = to_group;
    if (to_activity) params.to_activity = to_activity;
    if (ids) params.ids = ids;
    return this.httpClient.get<TagModel[]>(`${URL}/all`, { params: params });
  }

  AddSkill(data: TagCreateModel) {
    return this.httpClient.post<MessageModel>(`${URL}/user`, data);
  }

  DeleteSkill(id: number) {
    let params: any = {};
    if (id) params.tag_id = id;
    return this.httpClient.delete<MessageModel>(`${URL}/user`, {
      params: params,
    });
  }
}
