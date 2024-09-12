import { CityUpdateModel, ShortCityModel } from './city.model';
import { AddContact, ContactUserModel } from './contact.model';
import { Group2UserModel, GroupDBModel } from './group.models';
import { PortfolioModel } from './portfolio.model';
import { SubscriptionModel } from './subscription.model';
import { TagUserModel } from './tag.model';
import { VacancyWithGroupModel } from './vacancy.model';

export class Vacancy2UserModel {
  constructor(
    public vacancy_id: number,
    public user_id: number,
    public created_at: Date | string,
    public is_approved: boolean | undefined,
    public vacancy: VacancyWithGroupModel
  ) {}
}

export class GroupInviteWithGroupModel {
  constructor(
    public group_id: number,
    public user_id: number,
    public created_at: Date | string,
    public is_approved: boolean | undefined,
    public group: GroupDBModel
  ) {}
}

export class UserModel {
  constructor(
    public birthdate: string,
    public city: ShortCityModel | null,
    public contacts?: ContactUserModel[],
    public groups?: Group2UserModel[],
    public favorites?: SubscriptionModel[],
    public subscribers?: SubscriptionModel[],
    public tags?: TagUserModel[],
    public portfolios?: PortfolioModel[],
    public my_vacancies?: Vacancy2UserModel[],
    public invites?: GroupInviteWithGroupModel[]
  ) {}
}

export class UpdateUserModel {
  constructor(
    public username?: null | string,
    public firstname?: null | string,
    public lastname?: null | string,
    public birthdate?: null | string,
    public city?: null | CityUpdateModel,
    public add_contacts?: null | AddContact[],
    public delete_contacts?: null | number[]
  ) {}
}
