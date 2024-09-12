import { ActivityRequestGModel } from './activity_request.model';
import { ActivityTaskAModel } from './activity_task.model';
import { AvatarModel } from './avatar.model';
import { AddContact, ContactActivityModel } from './contact.model';
import { DecorationModel } from './decoration.model';
import { GroupWithTypeModel } from './group.models';
import { PortfolioModel } from './portfolio.model';
import { CommonStatusModel } from './status.model';
import { TagActivityModel } from './tag.model';
import { UserAbstractDBModel } from './user_abstract.model';
export class ActivityDBModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public group_id: number | null,
    public created_at: Date,
    public img: AvatarModel,
    public decoration: DecorationModel,
    public description: string,
    public fields: object,
    public status_id: number
  ) {}
}
export class ActivityModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public group_id: number | null,
    public created_at: Date,
    public img: AvatarModel,
    public decoration: DecorationModel,
    public description: string,
    public fields: object,
    public status_id: number,

    public status: CommonStatusModel,
    public direction_id?: number,
    public direction?: DirectionModel
  ) {}
}

export class DirectionModel {
  constructor(public id: number, public name: string, public icon: string) {}
}

export class FullActivityModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public group_id: number | null,
    public created_at: Date,
    public img: AvatarModel | null,
    public decoration: DecorationModel | null,
    public description: string,
    public fields: object,
    public status_id: number,

    public status: CommonStatusModel,
    public group: GroupWithTypeModel | null = null,
    public tags: TagActivityModel[] = [],
    public contacts: ContactActivityModel[],
    public requests: ActivityRequestGModel[],
    public tasks?: ActivityTaskAModel[],
    public creater?: UserAbstractDBModel,
    public portfolios?: PortfolioModel[],
    public direction_id?: number,
    public direction?: DirectionModel
  ) {}
}

export class LoadImgActivityModel {
  constructor(public activity_id: number | null, public file: any) {}
}

export class ActivityCreateModel {
  constructor(
    public name: string,
    public status_id: number,
    public direction_id: number,
    public description?: string | null
  ) {}
}
export class UpdateActivityModel {
  constructor(
    public activity_id: number,
    public name?: string,
    public description?: string,
    public status_id?: number,
    public direction_id?: number,

    public add_contacts?: null | AddContact[],
    public delete_contacts?: null | number[]
  ) {}
}
