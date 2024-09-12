from typing import List
from src.activity.schemas.activity import ActivitySchema
from src.activity.schemas.activity_request_g import ActivityRequestGSchema
from src.group.schemas.full_group_n import FullGroupWithUsers
from src.other.schemas.contact import ContactActivitySchema
from src.portfolio.schemas.portfolio import MainPortfolioSchema
from src.tag.schemas.tag_activity import TagActivitySchema
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class FullActivitySchema(ActivitySchema):
    group: FullGroupWithUsers | None = None
    creater: UserAbstractDBSchema | UserWithUserAbstractSchema
    tags: List[TagActivitySchema]
    contacts: List[ContactActivitySchema]
    requests: List[ActivityRequestGSchema]
    portfolios: List[MainPortfolioSchema]

    class Config:
        from_attributes = True
