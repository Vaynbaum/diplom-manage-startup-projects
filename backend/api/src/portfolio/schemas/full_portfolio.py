from src.activity.schemas.activity import ActivityDBSchema
from src.group.schemas.group import GroupDBSchema
from src.portfolio.schemas.portfolio import MainPortfolioSchema


class FullPortfolioSchema(MainPortfolioSchema):
    group: GroupDBSchema | None = None
    activity: ActivityDBSchema | None = None

    class Config:
        from_attributes = True
