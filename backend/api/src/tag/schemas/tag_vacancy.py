from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.tag.schemas.level import TagLevelSchema
from src.tag.schemas.tag import TagSchema


class TagVacancySchema(sqlalchemy_to_pydantic(TagVacancy)):
    tag_id: int | None
    vacancy_id: int | None
    level_id: int | None
    tag: TagSchema
    level: TagLevelSchema | None

    class Config:
        from_attributes = True
