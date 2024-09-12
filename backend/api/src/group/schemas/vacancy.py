from typing import List
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.group.schemas.group import GroupDBSchema
from src.group.schemas.vacancy_user import VacancyUserDBSchema
from src.tag.schemas.tag_vacancy import TagVacancySchema


class VacancyDBSchema(sqlalchemy_to_pydantic(Vacancy)):
    description: str | None = None
    is_active: bool | None = None

    class Config:
        from_attributes = True


class VacancyWithGroupSchema(VacancyDBSchema):
    group: GroupDBSchema

    class Config:
        from_attributes = True


class VacancySchema(VacancyDBSchema):
    tags: List[TagVacancySchema]
    users: List[VacancyUserDBSchema]

    class Config:
        from_attributes = True
