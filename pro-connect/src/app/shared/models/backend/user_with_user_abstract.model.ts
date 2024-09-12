import { UserAbstractDBModel } from './user_abstract.model';

export class UserWithUserAbstractModel {
  constructor(
    public birthdate: string,
    public user_abstract: UserAbstractDBModel
  ) {}
}
