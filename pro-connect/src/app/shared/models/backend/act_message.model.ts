import { CommonMaterialModel } from './activity_task.model';
import { UserAbstractDBModel } from './user_abstract.model';

export class CreateMessageModel {
  constructor(
    public text?: string,
    public activity_id?: number,
    public action: string = 'add',
    public id?: number
  ) {}
}

export class ActivityMessageModel {
  constructor(
    public id: number,
    public text: string,
    public created_at: string,
    public materials: CommonMaterialModel,
    public activity_id: number,
    public sender_id: number,
    public sender: UserAbstractDBModel,
    public mode: string,
    public activity_name: string,
    public date_copy?: string
  ) {}
}
