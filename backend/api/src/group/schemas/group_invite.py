from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.group.schemas.group import GroupDBSchema


class GroupInviteDBSchema(sqlalchemy_to_pydantic(GroupInvite)):
    is_approved: bool | None = None

    class Config:
        from_attributes = True


class GroupInviteWithGroupSchema(GroupInviteDBSchema):
    group: GroupDBSchema

    class Config:
        from_attributes = True
