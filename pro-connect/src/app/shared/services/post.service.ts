import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseItemsModel } from '../models/backend/response-items.model';
import {
  CreatePostModel,
  PostModel,
  UpdatePostModel,
} from '../models/backend/post.model';
import { MessageModel } from '../models/backend/message.model';

const URL = `${environment.BACKEND_URL}/posts`;

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClient) {}
  GetAllPosts(
    offset?: number,
    user_id?: number,
    group_id?: number,
    activity_id?: number,
    type_id?: number[],
    tag_ids?: number[],
    substr?: string
  ) {
    let params: any = {};
    if (offset) params.offset = offset;
    if (user_id) params.user_id = user_id;
    if (group_id) params.group_id = group_id;
    if (activity_id) params.activity_id = activity_id;
    if (type_id) params.type_ids = type_id;
    if (tag_ids) params.tag_ids = tag_ids;
    if (substr) params.substr = substr;

    return this.httpClient.get<ResponseItemsModel<PostModel>>(`${URL}/all`, {
      params: params,
    });
  }

  GetAllTypes() {
    return this.httpClient.get<ResponseItemsModel<PostModel>>(
      `${URL}/types/all`
    );
  }

  CreatePost(post: CreatePostModel) {
    return this.httpClient.post<PostModel>(`${URL}/`, post);
  }
  UpdatePost(post: UpdatePostModel) {
    return this.httpClient.put<PostModel>(`${URL}/`, post);
  }
  DeletePost(id: number) {
    return this.httpClient.delete<MessageModel>(`${URL}/`, {
      params: { id: id },
    });
  }

  LikePost(id: number) {
    return this.httpClient.get<boolean>(`${URL}/like`, {
      params: { post_id: id },
    });
  }
}
