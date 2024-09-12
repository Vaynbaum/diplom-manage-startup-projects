import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UpdateUserModel } from '../models/backend/user.model';
import { MessageModel } from '../models/backend/message.model';
import { DecorationModel } from '../models/backend/decoration.model';
import { ME } from '../consts';
import { checkId } from '../functions';
import {
  ShortUserWithUserAbstractModel,
  UserAbstractModel,
} from '../models/backend/user_abstract.model';
import { AvatarModel } from '../models/backend/avatar.model';
import { ResponseItemsModel } from '../models/backend/response-items.model';

const URL = `${environment.BACKEND_URL}/users`;
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  GetUserProfile(id?: string) {
    let params: any = {};
    if (id && id != ME) {
      if (checkId(id)) params.id = id.slice(2);
      else params.username = id;
    }

    return this.httpClient.get<UserAbstractModel>(`${URL}/profile/one`, {
      params: params,
    });
  }

  UpdateUser(user: UpdateUserModel) {
    return this.httpClient.put<MessageModel>(`${URL}/profile`, user);
  }

  LoadAvatar(fileImg: any) {
    let formData = new FormData();
    formData.append('file', fileImg);
    return this.httpClient.post<AvatarModel>(`${URL}/avatar`, formData);
  }

  LoadCover(fileImg: any) {
    let formData = new FormData();
    formData.append('file', fileImg);
    return this.httpClient.post<DecorationModel>(`${URL}/cover`, formData);
  }

  Subscription(id: number) {
    return this.httpClient.post<MessageModel>(`${URL}/subscription`, {
      favorite_id: id,
    });
  }

  Unsubscription(id: number) {
    let params: any = { favorite_id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/subscription`, {
      params: params,
    });
  }
  ResetEmail(email: string) {
    return this.httpClient.put<MessageModel>(`${URL}/reset_email`, {
      new_email: email,
    });
  }
  ResetPassword(password: string) {
    return this.httpClient.put<MessageModel>(`${URL}/reset_password`, {
      password: password,
    });
  }

  GetAllUsers(
    substr?: string,
    city_id?: number,
    tag_ids?: number[],
    min_age?: number,
    max_age?: number,
    limit?: number,
    offset?: number
  ) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (city_id) params.city_id = city_id;
    if (tag_ids) params.tag_ids = tag_ids;
    if (min_age) params.min_age = min_age;
    if (max_age) params.max_age = max_age;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return this.httpClient.get<
      ResponseItemsModel<ShortUserWithUserAbstractModel>
    >(`${URL}/profile/all`, {
      params: params,
    });
  }

  DeleteUser() {
    return this.httpClient.delete<MessageModel>(`${URL}/`);
  }
}
