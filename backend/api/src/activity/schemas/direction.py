from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class DirectionSchema(sqlalchemy_to_pydantic(Direction)):
    class Config:
        from_attributes = True
