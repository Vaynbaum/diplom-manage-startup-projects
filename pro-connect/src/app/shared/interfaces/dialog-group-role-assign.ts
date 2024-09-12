import {
  GroupRoleModel,
  GroupUser2Model,
} from '../models/backend/group.models';

export interface DialogGroupRoleAssignData {
  roles: GroupRoleModel[];
  user: GroupUser2Model;
}
