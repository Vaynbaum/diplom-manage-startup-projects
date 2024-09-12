export class ResetPasswordModel {
  constructor(public code: string, public password: string) {}
}
export class ActivationModel {
  constructor(public code: string) {}
}
