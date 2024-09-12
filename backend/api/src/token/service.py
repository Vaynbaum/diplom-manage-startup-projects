from datetime import datetime, timedelta
import jwt
from jose import JWTError
from pydantic import ValidationError

from src.config import settings
from src.token.consts import *
from src.token.exceptions import *
from src.token.schemas import *


class TokenService:
    def generate_tokens(self, data: TokenDataSchema) -> TokenSchema:
        access_payload = self.__constructor_payload(
            data,
            timedelta(days=0, minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            ACCESS_TOKEN,
        )
        refresh_payload = self.__constructor_payload(
            data, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS), REFRESH_TOKEN
        )
        access_token = self.__generate_token(access_payload)
        refresh_token = self.__generate_token(refresh_payload)
        return TokenSchema.Of(access_token, refresh_token)

    def decode_token(self, token: str, scope: str) -> TokenDataSchema:
        try:
            payload = jwt.decode(
                token, settings.SECRET_STRING, algorithms=[settings.ALGORITHM]
            )
            payload = self.__parse_payload(payload)
            if payload.scope == scope:
                if payload.user_id and payload.role_id:
                    return TokenDataSchema.Of(payload.user_id, payload.role_id)
                raise InvalidCredentialsException() from None
            raise ScopeTokenInvalidException() from None

        except jwt.ExpiredSignatureError:
            raise TokenExpiredException() from None
        except jwt.InvalidTokenError:
            raise InvalidTokenException() from None
        except (JWTError, ValidationError):
            raise InvalidCredentialsException() from None

    def __parse_payload(self, payload: dict):
        return PayloadScema(
            scope=payload[PAYLOAD_NAME_SCOPE],
            user_id=payload.get(PAYLOAD_NAME_SUB_ID),
            role_id=payload.get(PAYLOAD_NAME_SUB_ROLE_ID),
        )

    def __constructor_payload(
        self, data: TokenDataSchema, expires: timedelta, scope: str
    ):
        payload = {
            PAYLOAD_NAME_SCOPE: scope,
            PAYLOAD_NAME_SUB_ID: data.id,
            PAYLOAD_NAME_SUB_ROLE_ID: data.role_id,
            PAYLOAD_NAME_EXPIRES: datetime.utcnow() + expires,
            PAYLOAD_NAME_ISSUEDAT: datetime.utcnow(),
        }
        return payload

    def __generate_token(self, payload):
        return jwt.encode(payload, settings.SECRET_STRING, algorithm=settings.ALGORITHM)
