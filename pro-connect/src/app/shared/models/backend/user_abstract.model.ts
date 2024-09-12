import { AdminModel } from './admin.model';
import { AvatarModel } from './avatar.model';
import { ShortCityModel } from './city.model';
import { DecorationModel } from './decoration.model';
import { RoleModel } from './role.model';
import { SubscriptionModel } from './subscription.model';
import { UserModel } from './user.model';

export class UserAbstractDBModel {
  constructor(
    public id: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    public role_id: number,
    public decoration: DecorationModel,
    public avatar: AvatarModel,
    public username: string | null,
    public created_at: Date
  ) {}
}
export class ShortUserWithUserAbstractModel {
  constructor(
    public birthdate: string,
    public user_abstract: UserAbstractDBModel,
    public city: ShortCityModel | null,
    public favorites?: SubscriptionModel[],
    public subscribers?: SubscriptionModel[]
  ) {}
}

export class UserAbstractModel {
  constructor(
    public id: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    public username: string | null,
    public role_id: number,
    public decoration: DecorationModel,
    public avatar: AvatarModel,
    public created_at: Date,

    public role: RoleModel,
    public user?: UserModel,
    public admin?: AdminModel
  ) {}
}
