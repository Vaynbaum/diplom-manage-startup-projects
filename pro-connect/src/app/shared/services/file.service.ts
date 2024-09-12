import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonMaterial } from '../models/backend/activity_task.model';
import { MessageModel } from '../models/backend/message.model';
import { UploadFileModel } from '../models/backend/upload_file.model';
const URL = `${environment.BACKEND_IMAGE_URL}/files/`;

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClient: HttpClient) {}

  UploadFile(data: UploadFileModel) {
    let params: any = {};
    if (data.gen_blur_img) params.gen_blur_img = data.gen_blur_img;
    let formData = new FormData();
    formData.append('file', data.file);
    return this.httpClient.post<CommonMaterial>(URL, formData, {
      params: params,
    });
  }

  DeleteFile(id: number) {
    let params: any = { id: id };
    return this.httpClient.delete<MessageModel>(URL, { params: params });
  }

}
