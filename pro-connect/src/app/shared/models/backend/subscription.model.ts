import { UserAbstractDBModel } from './user_abstract.model';

export class SubscriptionModel {
  constructor(
    public created_at: Date,
    public subscriber?: UserAbstractDBModel,
    public favorite?: UserAbstractDBModel
  ) {}
}
