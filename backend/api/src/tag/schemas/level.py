from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class TagLevelSchema(sqlalchemy_to_pydantic(TagLevel)):
    icon: str | None = None

    class Config:
        from_attributes = True
