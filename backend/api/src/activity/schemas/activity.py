from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.activity.schemas.activity_status import ActivityStatusSchema
from src.activity.schemas.direction import DirectionSchema
from src.database.models import *
from src.user.schemas.avatar import AvatarSchema
from src.user.schemas.decoration import DecorationSchema


class ActivityDBSchema(sqlalchemy_to_pydantic(Activity)):
    description: str | None = None
    decoration: DecorationSchema | dict | None
    img: AvatarSchema | dict | None
    group_id: int | None = None
    direction_id: int | None = None

    class Config:
        from_attributes = True


class ActivitySchema(ActivityDBSchema):
    status: ActivityStatusSchema | None = None
    direction: DirectionSchema | None = None

    class Config:
        from_attributes = True
