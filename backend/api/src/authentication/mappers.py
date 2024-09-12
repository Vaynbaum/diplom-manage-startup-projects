from typing import Any
from fastapi.security import OAuth2PasswordRequestForm

from src.authentication.consts import ROLE_ID_USER
from src.database.models import *
from src.authentication.schemas import *
from src.common.consts import *
from src.common.mappers import BaseMapper
from src.database.schemas import RecordRedisSchema


class SigninInputMapper(BaseMapper[OAuth2PasswordRequestForm, SigninSchema]):
    def mapping(self, form_data: OAuth2PasswordRequestForm):
        return SigninSchema(email=form_data.username, password=form_data.password)


class PasswordRecoveryMapper:
    def mapping(self, value: bytes):
        return value.decode("utf-8")


class RecordRedisInputMapper(BaseMapper[str, RecordRedisSchema]):
    def mapping(self, key: str, value: Any, expire: int | None = None):
        return RecordRedisSchema(key=key, value=value, expire=expire)


class RecordRedisDBMapper(BaseMapper[Any, Any]):
    def mapping(sellf, item):
        return item.value


class UserAbstractInputMapper(BaseMapper[SignupScheme, UserAbstract]):
    def mapping(self, user: SignupScheme, role_id: int):
        return UserAbstract(
            email=user.email,
            hashed_password=user.password,
            firstname=user.firstname,
            lastname=user.lastname,
            avatar={},
            decoration={},
            role_id=role_id,
        )


class UserInputMapper(BaseMapper[SignupScheme, User]):
    def mapping(self, user: SignupScheme):
        user_abstract_db = UserAbstractInputMapper().mapping(user, ROLE_ID_USER)
        return User(user_abstract=user_abstract_db)
