import { ActivityDBModel } from './activity.model';
import { GroupDBModel } from './group.models';
import { CommonStatusModel } from './status.model';

export class CreateRequestModel {
  constructor(public group_id: number, public activity_id: number) {}
}
export class ActivityRequestAModel {
  constructor(
    public group_id: number,
    public activity_id: number,
    public status_id: number,
    public created_at: Date,
    public status: CommonStatusModel,
    public activity: ActivityDBModel
  ) {}
}
export class ActivityRequestGModel {
  constructor(
    public group_id: number,
    public activity_id: number,
    public status_id: number,
    public created_at: Date,
    public status: CommonStatusModel,
    public group: GroupDBModel
  ) {}
}
