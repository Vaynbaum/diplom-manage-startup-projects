from typing import List
from pydantic import BaseModel, Field

from src.tag.schemas.tag_create import TagCreateIdSchema, TagCreateNameSchema


class VacancyUpdateSchema(BaseModel):
    name: str
    description: str | None = None

    tag_ids: List[TagCreateIdSchema] | None = []
    tag_names: List[TagCreateNameSchema] | None = []
    delete_ids: List[int] | None = []


class VacancyCreateSchema(VacancyUpdateSchema):
    group_id: int = Field(gt=0)


class VacancyUpdateSchema(VacancyUpdateSchema):
    vacancy_id: int = Field(gt=0)
    is_active: bool
