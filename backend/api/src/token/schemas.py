from pydantic import BaseModel

from src.token.consts import TOKEN_TYPE_BEARER


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str | None = TOKEN_TYPE_BEARER

    @staticmethod
    def Of(access_token: str, refresh_token: str, token_type: str = TOKEN_TYPE_BEARER):
        return TokenSchema(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
        )


class TokenDataSchema(BaseModel):
    id: int
    role_id: int | None = None

    @staticmethod
    def Of(id: int, role_id: int):
        return TokenDataSchema(id=id, role_id=role_id)


class InpDataInform(BaseModel):
    action: str
    token_data: TokenDataSchema
    resource: dict


class PayloadScema(BaseModel):
    user_id: int
    role_id: int
    scope: str
