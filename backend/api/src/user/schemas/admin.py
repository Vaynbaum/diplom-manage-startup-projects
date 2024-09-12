from pydantic import Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class AdminSchema(sqlalchemy_to_pydantic(Admin)):
    id: int = Field(..., exclude=True)

    class Config:
        from_attributes = True
