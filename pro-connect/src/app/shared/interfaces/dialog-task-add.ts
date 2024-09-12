import {
  ActivityTaskAModel,
  TaskDialogModel,
} from '../models/backend/activity_task.model';
import { UserAbstractDBModel } from '../models/backend/user_abstract.model';

export interface DialogTaskAddData {
  task: TaskDialogModel;
}
export interface DialogTaskData {
  task: ActivityTaskAModel;
}
export interface DialogTaskWithUsersData {
  task: ActivityTaskAModel;
  users: UserAbstractDBModel[];
}
