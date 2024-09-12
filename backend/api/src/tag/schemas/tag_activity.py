from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.tag.schemas.tag import TagSchema


class TagActivitySchema(sqlalchemy_to_pydantic(TagActivity)):
    tag_id: int | None
    activity_id: int | None
    tag: TagSchema

    class Config:
        from_attributes = True
