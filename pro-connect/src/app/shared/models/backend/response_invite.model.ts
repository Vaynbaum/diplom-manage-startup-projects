export class ResponseInviteModel {
  constructor(public group_id: number, public is_approved: boolean) {}
}
export class CreateIviteModel {
  constructor(public group_id: number, public user_id: number) {}
}
