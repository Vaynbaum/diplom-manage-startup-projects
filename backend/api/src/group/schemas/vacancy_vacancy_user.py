from src.database.models import *
from src.group.schemas.vacancy import VacancyWithGroupSchema
from src.group.schemas.vacancy_user import VacancyUserDBSchema


class Vacancy2UserSchema(VacancyUserDBSchema):
    vacancy: VacancyWithGroupSchema

    class Config:
        from_attributes = True
