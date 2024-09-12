import { TaskUserAssModel } from '../models/backend/activity_task.model';

export interface DialogAssignsMoreData {
  users: TaskUserAssModel[];
  activity_id: number;
  canUnassign: boolean;
}
