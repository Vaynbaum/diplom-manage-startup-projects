from enum import Enum
from pydantic import BaseModel


class SubjectData(BaseModel):
    id: int
    role_id: int


class ResourceData(BaseModel):
    name: str
    id: int | str | None = None
    owner_id: int | None = None
    # details: dict | None = None


class ResultCheck(BaseModel):
    resource: ResourceData
    subject: SubjectData


class ActionData(BaseModel):
    name: str


class StatusAccess(Enum):
    allow = True
    denied = False
