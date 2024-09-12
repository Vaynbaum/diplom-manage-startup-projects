from typing import List
from pydantic import BaseModel, Field

from src.user.schemas.user_update import ContactAddSchema


class ActivityCreateSchema(BaseModel):
    name: str
    description: str | None = None
    status_id: int
    direction_id: int


class ActivityUpdateSchema(BaseModel):
    activity_id: int = Field(gt=0)
    name: str | None = None
    description: str | None = None
    status_id: int | None = Field(default=None, gt=0)
    direction_id: int | None = Field(default=None, gt=0)

    add_contacts: List[ContactAddSchema] | None = None
    delete_contacts: List[int] | None = None
