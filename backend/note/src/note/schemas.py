from datetime import datetime
from typing import List
from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class NotificationSchema(sqlalchemy_to_pydantic(Notification)):
    created_at: datetime | str

    class Config:
        from_attributes = True


class NoteInputSchema(BaseModel):
    text: str
    user_id: int


class ReadNoteSchema(BaseModel):
    ids: List[int] = []
