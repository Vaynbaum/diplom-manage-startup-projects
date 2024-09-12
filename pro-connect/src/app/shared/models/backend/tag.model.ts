export class TagModel {
  constructor(public name: string, public id: number) {}
}

export class TagLevelModel {
  constructor(public name: string, public id: number, public icon?: string) {}
}

export class TagUserModel {
  constructor(
    public tag: TagModel | null,
    public level: TagLevelModel | null
  ) {}
}

export class TagVacancyModel {
  constructor(
    public tag: TagModel | null,
    public level: TagLevelModel | null
  ) {}
}

export class TagPostModel {
  constructor(public tag: TagModel | null) {}
}

export class TagActivityModel {
  constructor(public tag: TagModel | null) {}
}

export class TagCreateIdModel {
  constructor(public tag_id: number, public level_id: number) {}
}
export class TagCreateNameModel {
  constructor(public tag_name: string, public level_id: number) {}
}
export class ShortTagCreateNameModel {
  constructor(public tag_name: string) {}
}
export class ShortTagCreateIdModel {
  constructor(public tag_id: number) {}
}

export class ShortTagCreateModel {
  constructor(
    public id: number,
    public tags?: null | ShortTagCreateIdModel[],
    public tag_names?: null | ShortTagCreateNameModel[]
  ) {}
}
export class TagCreateModel {
  constructor(
    public tags?: null | TagCreateIdModel[],
    public tag_names?: null | TagCreateNameModel[]
  ) {}
}

export class DeleteActivityTag {
  constructor(public activity_id: number, public tag_id: number) {}
}
