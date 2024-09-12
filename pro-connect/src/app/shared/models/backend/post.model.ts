import { ActivityDBModel } from './activity.model';
import { CommonMaterial, CommonMaterialModel, FileModel } from './activity_task.model';
import { GroupDBModel } from './group.models';
import {
  ShortTagCreateIdModel,
  ShortTagCreateNameModel,
  TagPostModel,
} from './tag.model';
import { CommonTypeModel } from './type.model';
import { UserAbstractDBModel } from './user_abstract.model';

export class PostLike {
  constructor(public user_id: number, public post_id: number) {}
}

export class CreatePostModel {
  constructor(
    public tag_ids: ShortTagCreateIdModel[] = [],
    public tag_names: ShortTagCreateNameModel[] = [],
    public files: FileModel[] = [],
    public text?: string | null,
    public activity_id?: number,
    public group_id?: number
  ) {}
}
export class UpdatePostModel {
  constructor(
    public post_id: number,
    public tag_ids: ShortTagCreateIdModel[] = [],
    public tag_names: ShortTagCreateNameModel[] = [],
    public delete_tag_ids: number[] = [],
    public files: FileModel[] = [],
    public delete_file_ids: number[] = [],
    public text?: string| null,
  ) {}
}

export class PostModel {
  constructor(
    public id: number,
    public text: string,
    public user_id: number | null,
    public group_id: number | null,
    public activity_id: number | null,
    public created_at: Date,
    public materials: CommonMaterialModel,
    public type_id: number,
    public type: CommonTypeModel,
    public group: GroupDBModel | null,
    public activity: ActivityDBModel | null,
    public tags: TagPostModel[],
    public user: UserAbstractDBModel | null,
    public likes: PostLike[] = [],
    public cnt_like: number,
    public shortText?: string
  ) {}
}
