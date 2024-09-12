import { ActivityDBModel } from '../models/backend/activity.model';
import { GroupDBModel } from '../models/backend/group.models';

export interface DialogRequestAddData {
  groups: GroupDBModel[];
  activity_id: number;
}
export interface DialogInvationAddData {
  activities: ActivityDBModel[];
  group_id: number;
}
