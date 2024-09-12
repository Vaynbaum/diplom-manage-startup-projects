from datetime import date
from typing import List
from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class ActivityTaskStatusShema(sqlalchemy_to_pydantic(ActivityTaskStatus)):
    class Config:
        from_attributes = True


class ActivityTaskDBShema(sqlalchemy_to_pydantic(ActivityTask)):
    description: str | None = None
    deadline: date | None = None
    materials: dict | None = None

    class Config:
        from_attributes = True


class ActivityTaskWithStatusShema(ActivityTaskDBShema):
    status: ActivityTaskStatusShema | None = None

    class Config:
        from_attributes = True


class TaskUserAssShema(sqlalchemy_to_pydantic(ActivityTaskAssignment)):
    user: UserAbstractDBSchema | UserWithUserAbstractSchema

    class Config:
        from_attributes = True


class ActivityTaskUsersShema(ActivityTaskWithStatusShema):
    users: List[TaskUserAssShema]

    class Config:
        from_attributes = True


class UploadFileSchema(BaseModel):
    id: int
    name: str
    owner_id: int
    details: dict


class CreateTaskSchema(BaseModel):
    name: str
    description: str | None = None
    activity_id: int = Field(gt=0)
    deadline: date | None = None
    status_id: int = Field(gt=0)
    files: List[UploadFileSchema] = []


class UpdateTaskSchema(BaseModel):
    task_id: int = Field(gt=0)
    name: str | None = None
    description: str | None = None
    deadline: date | None = None
    delete_ids: list[int] | None = None
    files: List[UploadFileSchema] = []
