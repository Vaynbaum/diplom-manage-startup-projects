import { CommonTypeModel } from './../models/backend/type.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AddGroupRoleModel,
  FullGroupModel,
  GroupCreateModel,
  GroupDBModel,
  GroupModel,
  GroupRoleAssignModel,
  GroupRoleModel,
  KickGroupUserModel,
  LoadImgGroupModel,
  UpdateGroupModel,
  UpdateGroupRoleModel,
} from '../models/backend/group.models';
import { checkId } from '../functions';
import { AvatarModel } from '../models/backend/avatar.model';
import { DecorationModel } from '../models/backend/decoration.model';
import { MessageModel } from '../models/backend/message.model';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import {
  CreateVacancyModel,
  UpdateVacancyModel,
  VacancyModel,
} from '../models/backend/vacancy.model';
import {
  ResponseApproveModel,
  VacancyResponseModel,
} from '../models/backend/vacancy_response.model';
import {
  CreateIviteModel,
  ResponseInviteModel,
} from '../models/backend/response_invite.model';

const URL = `${environment.BACKEND_URL}/groups`;

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  GetAllTypes() {
    return this.httpClient.get<CommonTypeModel[]>(`${URL}/types/all`);
  }

  GetGroupOne(id: string) {
    let params: any = {};
    if (checkId(id)) params.id = id.slice(2);
    else params.username = id;

    return this.httpClient.get<FullGroupModel>(`${URL}/one`, {
      params: params,
    });
  }

  LoadAvatar(data: LoadImgGroupModel) {
    let formData = new FormData();
    let params: any = { group_id: data.group_id };

    formData.append('file', data.file);
    return this.httpClient.post<AvatarModel>(`${URL}/avatar`, formData, {
      params: params,
    });
  }

  UpdateGroup(group: UpdateGroupModel) {
    return this.httpClient.put<MessageModel>(`${URL}/`, group);
  }

  Subscription(id: number) {
    return this.httpClient.post<MessageModel>(`${URL}/subscription`, {
      group_id: id,
    });
  }

  Unsubscription(id: number) {
    let params: any = { group_id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/unsubscription`, {
      params: params,
    });
  }

  GetRoles(id: number) {
    let params: any = { group_id: id };
    return this.httpClient.get<GroupRoleModel[]>(`${URL}/roles`, {
      params: params,
    });
  }

  LoadCover(data: LoadImgGroupModel) {
    let params: any = { group_id: data.group_id };
    let formData = new FormData();

    formData.append('file', data.file);
    return this.httpClient.post<DecorationModel>(`${URL}/cover`, formData, {
      params: params,
    });
  }

  AddGroupRole(role: AddGroupRoleModel) {
    return this.httpClient.post<MessageModel>(`${URL}/roles`, role);
  }

  UpdateGroupRole(role: UpdateGroupRoleModel) {
    return this.httpClient.put<MessageModel>(`${URL}/roles`, role);
  }

  DeleteGroupRole(id: number) {
    let params: any = { id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/roles`, {
      params: params,
    });
  }

  AssignRole(data: GroupRoleAssignModel) {
    return this.httpClient.post<MessageModel>(`${URL}/roles/assign`, data);
  }

  KickUser(data: KickGroupUserModel) {
    let params: any = { group_id: data.group_id, user_id: data.user_id };

    return this.httpClient.delete<MessageModel>(`${URL}/user`, {
      params: params,
    });
  }

  GetAllGroups(
    substr?: string,
    type_id?: number[],
    tag_ids?: number[],
    is_vac?: boolean,
    is_act?: boolean,
    limit?: number,
    offset?: number
  ) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (type_id) params.type_ids = type_id;
    if (tag_ids) params.tag_ids = tag_ids;
    if (is_vac) params.is_vac = is_vac;
    if (is_act) params.is_act = is_act;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return this.httpClient.get<ResponseItemsModel<GroupModel>>(`${URL}/all`, {
      params: params,
    });
  }

  CreateGroup(group: GroupCreateModel) {
    return this.httpClient.post<GroupDBModel>(`${URL}/`, group);
  }

  DeleteGroup(group_id: number) {
    let params: any = { group_id: group_id };
    return this.httpClient.delete<MessageModel>(`${URL}/`, { params: params });
  }

  CreateVacancy(vacancy: CreateVacancyModel) {
    return this.httpClient.post<MessageModel>(`${URL}/vacancy`, vacancy);
  }

  UpdateVacancy(vacancy: UpdateVacancyModel) {
    return this.httpClient.put<MessageModel>(`${URL}/vacancy`, vacancy);
  }

  DeleteVacancy(id: number) {
    let params: any = { vacancy_id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/vacancy`, {
      params: params,
    });
  }

  CreateResponseVacancy(id: number) {
    return this.httpClient.post<MessageModel>(`${URL}/vacancy/response`, {
      vacancy_id: id,
    });
  }

  ApproveResponse(data: ResponseApproveModel) {
    return this.httpClient.post<MessageModel>(
      `${URL}/vacancy/response/approve`,
      data
    );
  }

  RejectResponse(data: ResponseApproveModel) {
    return this.httpClient.post<MessageModel>(
      `${URL}/vacancy/response/reject`,
      data
    );
  }

  GetVacancyById(id: number) {
    let params: any = { vacancy_id: id };
    return this.httpClient.get<VacancyModel>(`${URL}/vacancy/one`, {
      params: params,
    });
  }

  GetResponses(id: number, offset?: number, limit?: number) {
    let params: any = { vacancy_id: id };
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return this.httpClient.get<ResponseItemsModel<VacancyResponseModel>>(
      `${URL}/vacancy/responses`,
      {
        params: params,
      }
    );
  }

  GetMyGroups() {
    return this.httpClient.get<GroupDBModel[]>(`${URL}/all/my`);
  }

  DeleteVacancyResponse(vacancy_id: number) {
    let params: any = { vacancy_id: vacancy_id };
    return this.httpClient.delete<MessageModel>(`${URL}/vacancy/response`, {
      params: params,
    });
  }

  DeleteInvite(group_id: number) {
    let params: any = { group_id: group_id };
    return this.httpClient.delete<MessageModel>(`${URL}/invites`, {
      params: params,
    });
  }

  PutInvite(data: ResponseInviteModel) {
    return this.httpClient.put<MessageModel>(`${URL}/invites`, data);
  }

  AddInvite(data: CreateIviteModel) {
    return this.httpClient.post<MessageModel>(`${URL}/invites`, data);
  }
}
