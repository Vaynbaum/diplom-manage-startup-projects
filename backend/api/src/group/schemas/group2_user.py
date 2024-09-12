from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.group.schemas.group import GroupSchema
from src.database.models import *


class Group2UserSchema(sqlalchemy_to_pydantic(GroupUser)):
    group: GroupSchema

    class Config:
        from_attributes = True
