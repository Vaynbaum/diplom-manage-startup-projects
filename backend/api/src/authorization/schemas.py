from enum import Enum
from pydantic import BaseModel


class SubjectData(BaseModel):
    id: int
    role_id: int
    details: dict | list | None = None


class ActionData(BaseModel):
    name: str
    details: dict | list | None = None


class ResourceData(BaseModel):
    name: str
    id: int | str | None = None
    owner_id: int | None = None
    details: dict | list | None = None


class ResourceRoleData(ResourceData):
    role_id: int | None = None


class StatusAccess(Enum):
    allow = True
    denied = False


class ResultCheck(BaseModel):
    resource: ResourceData
    subject: SubjectData
