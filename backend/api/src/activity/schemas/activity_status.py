from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class ActivityStatusSchema(sqlalchemy_to_pydantic(ActivityStatus)):
    class Config:
        from_attributes = True
