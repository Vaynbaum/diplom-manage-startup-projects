from typing import List
from pydantic import BaseModel, Field

from src.user.schemas.user_update import ContactAddSchema


class GroupCreateSchema(BaseModel):
    name: str
    note: str | None = None
    type_id: int


class GroupUpdateSchema(BaseModel):
    group_id: int = Field(gt=0)
    name: str | None = None
    note: str | None = None
    username: str | None = None
    type_id: int | None = None
    add_contacts: List[ContactAddSchema] | None = None
    delete_contacts: List[int] | None = None
