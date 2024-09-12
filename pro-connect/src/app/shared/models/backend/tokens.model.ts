export class TokenModel {
  constructor(public token: string | null, public token_type: string | null) {}
}

export class TokensModel {
  constructor(
    public access_token: string,
    public token_type: string,
    public refresh_token: string
  ) {}
}
