from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from pydantic import Field

from src.group.schemas.group_role import GroupRoleSchema
from src.database.models import *
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class GroupUserDBSchema(sqlalchemy_to_pydantic(GroupUser)):
    class Config:
        from_attributes = True


class GroupUser2SNchema(GroupUserDBSchema):
    user: UserAbstractDBSchema | UserWithUserAbstractSchema

    class Config:
        from_attributes = True


class GroupUser2Schema(GroupUser2SNchema):
    group_id: int | None = Field(..., exclude=True)
    user_id: int | None = Field(..., exclude=True)
    role_id: int | None = Field(..., exclude=True)
    role: GroupRoleSchema

    class Config:
        from_attributes = True
