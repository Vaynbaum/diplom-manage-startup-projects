from pydantic import Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.tag.schemas.tag import TagSchema
from src.tag.schemas.level import TagLevelSchema


class TagUserSchema(sqlalchemy_to_pydantic(TagUser)):
    tag_id: int | None = Field(..., exclude=True)
    user_id: int | None = Field(..., exclude=True)
    level_id: int | None = Field(..., exclude=True)
    tag: TagSchema
    level: TagLevelSchema | None

    class Config:
        from_attributes = True
