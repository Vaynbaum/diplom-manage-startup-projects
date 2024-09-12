import { UserAbstractDBModel } from '../models/backend/user_abstract.model';

export interface DialogInviteAddData {
  freinds: UserAbstractDBModel[];
  group_id: number;
}
