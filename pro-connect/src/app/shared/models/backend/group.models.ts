import { ActivityModel } from './activity.model';
import { ActivityRequestAModel } from './activity_request.model';
import { AvatarModel } from './avatar.model';
import { AddContact, ContactGroupModel } from './contact.model';
import { DecorationModel } from './decoration.model';
import { PortfolioModel } from './portfolio.model';
import { CommonTypeModel } from './type.model';
import { UserAbstractDBModel } from './user_abstract.model';
import { VacancyModel } from './vacancy.model';

export class GroupModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public type_id: number,
    public note: string | null,
    public type: CommonTypeModel,
    public created_at: Date,
    public decoration: DecorationModel | null,
    public avatar: AvatarModel | null,
    public username: string | null,
    public users?: GroupUserDBModel[]
  ) {}
}

export class Group2UserModel {
  constructor(public created_at: string | Date, public group: GroupModel) {}
}

export class GroupRoleModel {
  constructor(
    public id: number,
    public name: string,
    public is_common: boolean
  ) {}
}

export class GroupUserDBModel {
  constructor(
    public created_at: string | Date,
    public user_id: number,
    public role_id: number
  ) {}
}

export class GroupUser2Model {
  constructor(
    public created_at: string | Date,
    public user: UserAbstractDBModel,
    public role: GroupRoleModel
  ) {}
}

export class FullGroupModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public type_id: number,
    public note: string | null,
    public type: CommonTypeModel,
    public created_at: Date,
    public decoration: DecorationModel | null,
    public avatar: AvatarModel | null,
    public username: string | null,

    public users: GroupUser2Model[],
    public contacts: ContactGroupModel[],
    public vacancies: VacancyModel[],
    public activities: ActivityModel[],
    public requests: ActivityRequestAModel[],
    public portfolios?: PortfolioModel[]
  ) {}
}

export class LoadImgGroupModel {
  constructor(public group_id: number | null, public file: any) {}
}

export class AddGroupRoleModel {
  constructor(public group_id: number | undefined, public name: string) {}
}

export class UpdateGroupRoleModel {
  constructor(public id: number, public name: string) {}
}

export class UpdateGroupModel {
  constructor(
    public group_id?: number,
    public username?: null | string,
    public name?: null | string,
    public note?: null | string,
    public type_id?: null | number,

    public add_contacts?: null | AddContact[],
    public delete_contacts?: null | number[]
  ) {}
}
export class GroupRoleAssignModel {
  constructor(
    public group_id?: number,
    public user_id?: number,
    public role_id?: number
  ) {}
}
export class KickGroupUserModel {
  constructor(public group_id?: number, public user_id?: number) {}
}

export class GroupCreateModel {
  constructor(
    public name: string,
    public type_id: number,
    public note?: string | null
  ) {}
}
export class GroupDBModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public type_id: number,
    public note: string | null,
    public created_at: Date,
    public decoration: DecorationModel | null,
    public avatar: AvatarModel | null,
    public username: string | null
  ) {}
}

export class GroupUser2NModel {
  constructor(
    public group_id: number,
    public user_id: number,
    public role_id: number,
    public created_at: string | Date,
    public user: UserAbstractDBModel
  ) {}
}

export class GroupWithTypeModel {
  constructor(
    public id: number,
    public name: string,
    public creater_id: number,
    public type_id: number,
    public note: string | null,
    public created_at: Date,
    public decoration: DecorationModel | null,
    public avatar: AvatarModel | null,
    public username: string | null,
    public users: GroupUser2NModel[],
    public type: CommonTypeModel
  ) {}
}
