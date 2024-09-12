import { CommonMaterial, FileModel } from './activity_task.model';
import {
  ShortTagCreateIdModel,
  ShortTagCreateNameModel,
  TagModel,
} from './tag.model';

export class PortfolioTypeDetail {
  constructor(
    public label: string,
    public placeholder: string,
    public icon?: string
  ) {}
}
export class PortfolioTypeDetails {
  constructor(
    public name: PortfolioTypeDetail,
    public value: PortfolioTypeDetail
  ) {}
}
export class PortfolioType {
  constructor(
    public id: number,
    public name: string,
    public details: PortfolioTypeDetails
  ) {}
}

export class TagPortfolioModel {
  constructor(public tag: TagModel | null) {}
}

export class PortfolioMaterial {
  constructor(public img?: CommonMaterial, public file?: CommonMaterial) {}
}

export class PortfolioModel {
  constructor(
    public id: number,
    public name: string,
    public type_id: number,
    public type: PortfolioType | null = null,
    public note: string | null | undefined = null,
    public value: string | null | undefined = null,
    public user_id: number | null = null,
    public group_id: number | null = null,
    public activity_id: number | null = null,
    public getted_at: Date | string | null = null,
    public material: PortfolioMaterial | null = null,
    public tags: TagPortfolioModel[] = []
  ) {}
}

export class CreatePortfolioModel {
  constructor(
    public name: string,
    public value: string | undefined | null,
    public note: string | undefined | null,
    public type_id: number,
    public group_id: number | undefined | null,
    public activity_id: number | undefined | null,
    public getted_at: string | undefined | null,
    public tag_ids: ShortTagCreateIdModel[] = [],
    public tag_names: ShortTagCreateNameModel[] = [],
    public file: FileModel | null
  ) {}
}
export class UpdatePortfolioModel {
  constructor(
    public id: number,
    public name: string,
    public value: string | undefined | null,
    public note: string | undefined | null,
    public type_id: number,
    public getted_at: string,
    public tag_ids: ShortTagCreateIdModel[] = [],
    public tag_names: ShortTagCreateNameModel[] = [],
    public delete_tag_ids: number[],
    public file: FileModel | null,
    public delete_file_id: number | undefined | null
  ) {}
}
