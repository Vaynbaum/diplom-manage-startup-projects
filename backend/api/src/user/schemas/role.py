from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class RoleSchema(sqlalchemy_to_pydantic(Role)):
    class Config:
        from_attributes = True