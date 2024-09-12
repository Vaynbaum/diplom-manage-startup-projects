from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class TagSchema(sqlalchemy_to_pydantic(Tag)):

    class Config:
        from_attributes = True
