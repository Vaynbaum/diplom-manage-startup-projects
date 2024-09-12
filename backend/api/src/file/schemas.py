from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class FileSchema(sqlalchemy_to_pydantic(FileModel)):
    class Config:
        from_attributes = True