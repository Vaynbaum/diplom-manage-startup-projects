from datetime import date
from typing import List
from pydantic import BaseModel, Field

from src.activity.schemas.task import UploadFileSchema
from src.tag.schemas.tag_create import SimpleTagCreateId, SimpleTagCreateName


class PortfolioCreateSchema(BaseModel):
    name: str
    value: str | None = None
    note: str | None = None
    type_id: int = Field(gt=0)
    group_id: int | None = Field(gt=0, default=None)
    activity_id: int | None = Field(gt=0, default=None)
    getted_at: date | None = None
    tag_ids: List[SimpleTagCreateId] = []
    tag_names: List[SimpleTagCreateName] = []
    file: UploadFileSchema | None = None


class PortfolioUpdateSchema(BaseModel):
    id: int
    name: str | None = None
    note: str | None = None
    value: str | None = None
    type_id: int | None = Field(gt=0, default=None)
    getted_at: date | None = None

    delete_tag_ids: list[int] = []
    tag_ids: List[SimpleTagCreateId] = []
    tag_names: List[SimpleTagCreateName] = []

    file: UploadFileSchema | None = None
    delete_file_id: int | None = None
