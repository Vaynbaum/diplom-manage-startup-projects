export class DetailsSchemaModel {
  constructor(public copy_sucess: string, public copy_fail: string) {}
}

export class ContactModel {
  constructor(
    public id: number,
    public title: string,
    public icon: string,
    public is_redirect: boolean,
    public prefix?: string,
    public details?: DetailsSchemaModel
  ) {}
}

export class ContactUserModel {
  constructor(
    public value: string,
    public id?: number,
    public contact?: ContactModel
  ) {}
}

export class ContactGroupModel {
  constructor(
    public value: string,
    public id?: number,
    public contact?: ContactModel
  ) {}
}

export class ContactActivityModel {
  constructor(
    public value: string,
    public id?: number,
    public contact?: ContactModel
  ) {}
}

export class AddContact {
  constructor(public contact_id: number, public value: string) {}
}
