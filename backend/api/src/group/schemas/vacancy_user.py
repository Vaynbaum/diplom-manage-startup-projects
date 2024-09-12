from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class VacancyUserDBSchema(sqlalchemy_to_pydantic(VacancyUser)):
    is_approved: bool | None = None

    class Config:
        from_attributes = True


class VacancyUser2Schema(VacancyUserDBSchema):
    user: UserAbstractDBSchema | UserWithUserAbstractSchema

    class Config:
        from_attributes = True
