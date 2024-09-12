from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class GroupRoleSchema(sqlalchemy_to_pydantic(GroupRole)):
    group_id: int | None = Field(..., exclude=True)

    class Config:
        from_attributes = True


class GroupRoleCreateSchema(BaseModel):
    name: str = Field(min_length=1)
    group_id: int = Field(gt=0)


class GroupRoleUpdateSchema(BaseModel):
    name: str = Field(min_length=1)
    id: int = Field(gt=0)


class GroupRoleAssignSchema(BaseModel):
    group_id: int = Field(gt=0)
    user_id: int = Field(gt=0)
    role_id: int = Field(gt=0)


class KickUserSchema(BaseModel):
    group_id: int = Field(gt=0)
    user_id: int = Field(gt=0)
