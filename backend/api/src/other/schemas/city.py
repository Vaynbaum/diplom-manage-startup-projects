from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class CityShortSchema(sqlalchemy_to_pydantic(City)):
    class Config:
        from_attributes = True


class RegionSchema(sqlalchemy_to_pydantic(Region)):
    class Config:
        from_attributes = True


class CitySchema(CityShortSchema):
    region_id: int | None = Field(..., exclude=True)
    region: RegionSchema | None = None

    class Config:
        from_attributes = True


class CityUpdateSchema(BaseModel):
    id: int | None = None
    name: str | None = None
    region_id: int | None = None
    region_name: str | None = None
