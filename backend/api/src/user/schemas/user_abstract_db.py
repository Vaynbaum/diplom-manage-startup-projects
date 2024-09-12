from pydantic import Field, SecretStr
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.user.schemas.avatar import AvatarSchema
from src.user.schemas.decoration import DecorationSchema


class UserAbstractDBSchema(sqlalchemy_to_pydantic(UserAbstract)):
    hashed_password: str | SecretStr = Field(..., exclude=True)
    decoration: DecorationSchema | dict | None
    avatar: AvatarSchema | dict | None
    username: str | None = None

    class Config:
        from_attributes = True
