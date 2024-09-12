import {
  TagActivityModel,
  TagLevelModel,
  TagUserModel,
} from '../models/backend/tag.model';

export interface DialogSkillAddData {
  levels: TagLevelModel[];
  tag: TagUserModel;
}
export interface DialogTagAddData {
  tag: TagActivityModel;
}
