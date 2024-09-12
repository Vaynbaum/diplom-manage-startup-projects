from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class PortfolioTypeSchema(sqlalchemy_to_pydantic(PortfolioType)):
    details: dict | None = None

    class Config:
        from_attributes = True
