import { CommonMaterial } from '../models/backend/activity_task.model';
import { PostModel } from '../models/backend/post.model';

export interface DialogPostAddData {
  post: PostModel | null;
  files: CommonMaterial[];
  user_id?: number;
  activity_id?: number;
  group_id?: number;
}
