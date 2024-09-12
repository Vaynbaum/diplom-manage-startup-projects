import { GroupDBModel } from './group.models';
import {
  TagCreateIdModel,
  TagCreateNameModel,
  TagVacancyModel,
} from './tag.model';
import { VacancyResponseDBModel } from './vacancy_response.model';

export class CreateVacancyModel {
  constructor(
    public name: string,
    public description: string,
    public group_id: number,

    public tag_ids?: null | TagCreateIdModel[],
    public tag_names?: null | TagCreateNameModel[],
    public delete_ids?: null | number[]
  ) {}
}

export class UpdateVacancyModel {
  constructor(
    public name: string,
    public description: string,
    public vacancy_id: number,
    public is_active: boolean,

    public tag_ids?: null | TagCreateIdModel[],
    public tag_names?: null | TagCreateNameModel[],
    public delete_ids?: null | number[]
  ) {}
}
export class VacancyWithGroupModel {
  constructor(
    public id: number,
    public created_at: Date,
    public description: string | null,
    public group_id: number,
    public is_active: boolean,
    public name: string,

    public group: GroupDBModel
  ) {}
}

export class VacancyModel {
  constructor(
    public id: number,
    public created_at: Date,
    public description: string | null,
    public group_id: number,
    public is_active: boolean,
    public name: string,

    public tags?: TagVacancyModel[],
    public users?: VacancyResponseDBModel[]
  ) {}
}
