import { UserAbstractDBModel } from './user_abstract.model';

export class ResponseApproveModel {
  constructor(public vacancy_id: number, public user_id: number) {}
}

export class VacancyResponseDBModel {
  constructor(
    public vacancy_id: number,
    public user_id: number,
    public created_at: Date,
    public is_approved: boolean | null
  ) {}
}

export class VacancyResponseModel {
  constructor(
    public vacancy_id: number,
    public user_id: number,
    public created_at: Date,
    public is_approved: boolean | null,
    public user: UserAbstractDBModel
  ) {}
}
