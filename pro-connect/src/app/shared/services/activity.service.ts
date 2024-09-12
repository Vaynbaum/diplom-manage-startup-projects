import { Injectable } from '@angular/core';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ActivityCreateModel,
  ActivityDBModel,
  ActivityModel,
  DirectionModel,
  FullActivityModel,
  LoadImgActivityModel,
  UpdateActivityModel,
} from '../models/backend/activity.model';
import { AvatarModel } from '../models/backend/avatar.model';
import { DecorationModel } from '../models/backend/decoration.model';
import { CommonStatusModel } from '../models/backend/status.model';
import { MessageModel } from '../models/backend/message.model';
import {
  DeleteActivityTag,
  ShortTagCreateModel,
} from '../models/backend/tag.model';
import { CreateRequestModel } from '../models/backend/activity_request.model';
import {
  ActivityTaskAModel,
  AssignTaskModel,
  ChangeStatusModel,
  CreateTaskModel,
  UpdateTaskModel,
} from '../models/backend/activity_task.model';

const URL = `${environment.BACKEND_URL}/activities`;
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private httpClient: HttpClient) {}

  GetAllStatuses() {
    return this.httpClient.get<CommonStatusModel[]>(`${URL}/status/all`);
  }
  GetAllDirections() {
    return this.httpClient.get<DirectionModel[]>(`${URL}/direction/all`);
  }

  GetAllActivities(
    substr?: string,
    status_ids?: number[],
    direction_ids?: number[],
    tag_ids?: number[],
    is_group?: boolean,
    limit?: number,
    offset?: number
  ) {
    let params: any = {};
    if (substr) params.substr = substr;
    if (status_ids) params.status_ids = status_ids;
    if (tag_ids) params.tag_ids = tag_ids;
    if (direction_ids) params.direction_ids = direction_ids;
    if (is_group) params.is_group = is_group;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return this.httpClient.get<ResponseItemsModel<ActivityModel>>(
      `${URL}/all`,
      { params: params }
    );
  }

  GetActivity(id: number) {
    let params: any = { id: id };
    return this.httpClient.get<FullActivityModel>(`${URL}/one`, {
      params: params,
    });
  }
  LoadAvatar(data: LoadImgActivityModel) {
    let formData = new FormData();
    let params: any = { activity_id: data.activity_id };

    formData.append('file', data.file);
    return this.httpClient.post<AvatarModel>(`${URL}/avatar`, formData, {
      params: params,
    });
  }
  LoadCover(data: LoadImgActivityModel) {
    let params: any = { activity_id: data.activity_id };
    let formData = new FormData();

    formData.append('file', data.file);
    return this.httpClient.post<DecorationModel>(`${URL}/cover`, formData, {
      params: params,
    });
  }

  CreateActivity(activity: ActivityCreateModel) {
    return this.httpClient.post<ActivityDBModel>(`${URL}/`, activity);
  }

  UpdateActivity(activity: UpdateActivityModel) {
    return this.httpClient.put<MessageModel>(`${URL}/`, activity);
  }

  DeleteActivity(id: number) {
    let params: any = { activity_id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/`, { params: params });
  }

  AddSkill(data: ShortTagCreateModel) {
    let params: any = { activity_id: data.id };
    return this.httpClient.post<MessageModel>(
      `${environment.BACKEND_URL}/tags/activity`,
      data,
      { params: params }
    );
  }

  DeleteSkill(data: DeleteActivityTag) {
    let params: any = { tag_id: data.tag_id, activity_id: data.activity_id };
    return this.httpClient.delete<MessageModel>(
      `${environment.BACKEND_URL}/tags/activity`,
      {
        params: params,
      }
    );
  }
  AddRequest(data: CreateRequestModel) {
    return this.httpClient.post<MessageModel>(`${URL}/request`, data);
  }
  AddInvitation(data: CreateRequestModel) {
    return this.httpClient.post<MessageModel>(`${URL}/invitation`, data);
  }
  DeleteRequest(data: CreateRequestModel) {
    let params: any = {
      group_id: data.group_id,
      activity_id: data.activity_id,
    };

    return this.httpClient.delete<MessageModel>(`${URL}/request`, {
      params: params,
    });
  }
  DeleteInvitation(data: CreateRequestModel) {
    let params: any = {
      group_id: data.group_id,
      activity_id: data.activity_id,
    };
    return this.httpClient.delete<MessageModel>(`${URL}/invitation`, {
      params: params,
    });
  }
  GetMyActivities() {
    return this.httpClient.get<ActivityDBModel[]>(`${URL}/all/my`);
  }
  ApproveInvitation(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/invitation/approve`, data);
  }
  RejectInvitation(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/invitation/reject`, data);
  }
  ApproveRequest(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/request/approve`, data);
  }
  RejectRequest(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/request/reject`, data);
  }
  ExitGroup(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/exit`, data);
  }
  KickGroup(data: CreateRequestModel) {
    return this.httpClient.put<MessageModel>(`${URL}/kick/group`, data);
  }
  GetTasks(activity_id: number) {
    let params: any = { activity_id: activity_id };
    return this.httpClient.get<ActivityTaskAModel[]>(`${URL}/task/all`, {
      params: params,
    });
  }
  CreateTask(task: CreateTaskModel) {
    return this.httpClient.post<MessageModel>(`${URL}/task`, task);
  }
  UpdateTask(task: UpdateTaskModel) {
    return this.httpClient.put<MessageModel>(`${URL}/task`, task);
  }
  DeleteTask(id: number) {
    let params: any = { id: id };
    return this.httpClient.delete<MessageModel>(`${URL}/task`, {
      params: params,
    });
  }
  GetTaskStatuses() {
    return this.httpClient.get<CommonStatusModel[]>(`${URL}/task/status/all`);
  }
  ChangeStatus(data: ChangeStatusModel) {
    return this.httpClient.put<MessageModel>(`${URL}/task/status`, data);
  }
  AssignTask(data: AssignTaskModel) {
    return this.httpClient.post<MessageModel>(`${URL}/task/assign`, data);
  }
  UnassignTask(data: AssignTaskModel) {
    let params: any = { task_id: data.task_id, user_id: data.user_id };
    return this.httpClient.delete<MessageModel>(`${URL}/task/assign`, {
      params: params,
    });
  }
}
