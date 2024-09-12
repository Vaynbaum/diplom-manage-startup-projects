import { CommonStatusModel } from './status.model';
import { UserAbstractDBModel } from './user_abstract.model';

export class FileModel {
  constructor(
    public id: number,
    public name: string,
    public owner_id: number,
    public details: object
  ) {}
}
export class AssignTaskModel {
  constructor(public task_id: number, public user_id: number) {}
}
export class ChangeStatusModel {
  constructor(public task_id: number, public status_id: number) {}
}
export class UpdateTaskModel {
  constructor(
    public name: string,
    public task_id: number,
    public delete_ids: number[],
    public files: FileModel[],
    public description?: string | null,
    public deadline?: string | null
  ) {}
}

export class CreateTaskModel {
  constructor(
    public name: string,
    public activity_id: number,
    public status_id: number,
    public files: FileModel[],
    public description?: string | null,
    public deadline?: string | null
  ) {}
}

export class FileDetailModel {
  constructor(public old_name: string, public blur_image: CommonMaterial) {}
}

export class CommonMaterial {
  constructor(
    public id: number,
    public name: string,
    public details: FileDetailModel,
    public owner_id: number,
    public created_at?: string,
    public type?: string,
    public isJustAdded?: boolean
  ) {}
}

export class CommonMaterialModel {
  constructor(
    public files: CommonMaterial[],
    public images: CommonMaterial[]
  ) {}
}

export class TaskUserAssModel {
  constructor(
    public user_id: number,
    public task_id: number,
    public created_at: Date,
    public user: UserAbstractDBModel
  ) {}
}

export class TaskDialogModel {
  constructor(
    public name: string,
    public files: CommonMaterial[] = [],
    public description?: string | null,
    public deadline?: Date | null
  ) {}
}

export class ActivityTaskAModel {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public creater_id: number,
    public activity_id: number,
    public status_id: number,
    public deadline: Date,
    public created_at: Date,
    public materials: CommonMaterialModel,
    public status: CommonStatusModel,
    public users: TaskUserAssModel[]
  ) {}
}
