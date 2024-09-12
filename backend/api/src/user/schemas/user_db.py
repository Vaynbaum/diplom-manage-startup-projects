from datetime import date
from pydantic import Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class UserDBSchema(sqlalchemy_to_pydantic(User)):
    city_id: int | None = Field(..., exclude=True)
    birthdate: date | None = None
