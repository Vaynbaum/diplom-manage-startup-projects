from datetime import date
from typing import List
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.portfolio.schemas.type import PortfolioTypeSchema
from src.tag.schemas.tag import TagSchema


class PostTagSchema(sqlalchemy_to_pydantic(TagPortfolio)):
    tag_id: int | None
    portfolio_id: int | None
    tag: TagSchema

    class Config:
        from_attributes = True


class PortfolioDBSchema(sqlalchemy_to_pydantic(Portfolio)):
    note: str | None = None
    value: str | None = None
    user_id: int | None = None
    activity_id: int | None = None
    group_id: int | None = None
    material: dict | None = None
    getted_at: date | None = None

    class Config:
        from_attributes = True


class MainPortfolioSchema(PortfolioDBSchema):
    type: PortfolioTypeSchema
    tags: List[PostTagSchema] = []

    class Config:
        from_attributes = True
