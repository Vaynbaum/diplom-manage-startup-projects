from typing import List
from pydantic import BaseModel, Field

from src.activity.schemas.task import UploadFileSchema
from src.tag.schemas.tag_create import SimpleTagCreateId, SimpleTagCreateName


class PostCreateSchema(BaseModel):
    group_id: int | None = Field(gt=0, default=None)
    activity_id: int | None = Field(gt=0, default=None)
    text: str | None = None
    tag_ids: List[SimpleTagCreateId] = []
    tag_names: List[SimpleTagCreateName] = []
    files: List[UploadFileSchema] = []


class PostUpdateSchema(BaseModel):
    post_id: int = Field(gt=0)
    text: str | None = None
    files: List[UploadFileSchema] = []
    delete_file_ids: list[int] | None = None

    tag_ids: List[SimpleTagCreateId] = []
    tag_names: List[SimpleTagCreateName] = []
    delete_tag_ids: list[int] = []
