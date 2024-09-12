from typing import List
from pydantic import Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.group.schemas.group_type import GroupTypeSchema
from src.database.models import *
from src.group.schemas.group_user2 import GroupUserDBSchema
from src.user.schemas.avatar import AvatarSchema
from src.user.schemas.decoration import DecorationSchema


class GroupDBSchema(sqlalchemy_to_pydantic(Group)):
    note: str | None = None
    decoration: DecorationSchema | dict | None
    avatar: AvatarSchema | dict | None
    username: str | None = None

    class Config:
        from_attributes = True


class GroupSchema(GroupDBSchema):
    type: GroupTypeSchema | None = None

    class Config:
        from_attributes = True


class GroupWithUserSchema(GroupSchema):
    users: List[GroupUserDBSchema] = []

    class Config:
        from_attributes = True
