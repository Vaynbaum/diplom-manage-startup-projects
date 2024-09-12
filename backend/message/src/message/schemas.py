from datetime import datetime
from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.message.const import ADD
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class MessageInputSchema(BaseModel):
    action: str = ADD
    id: int | None = Field(gt=0, default=None)
    text: str | None = Field(default=None)
    activity_id: int | None = Field(gt=0, default=None)


class MessageDBSchema(sqlalchemy_to_pydantic(MessageModel)):
    created_at: datetime | str

    class Config:
        from_attributes = True


class FullMessageSchema(MessageDBSchema):
    sender: UserAbstractDBSchema | UserWithUserAbstractSchema
    mode: str | None = None

    class Config:
        from_attributes = True
