from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class GroupTypeSchema(sqlalchemy_to_pydantic(GroupType)):
    class Config:
        from_attributes = True
