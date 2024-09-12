from typing import List

from src.activity.schemas.activity import ActivityDBSchema, ActivitySchema
from src.activity.schemas.activity_request import ActivityRequestSSchema
from src.group.schemas.group import GroupSchema
from src.group.schemas.group_user2 import GroupUser2Schema
from src.group.schemas.vacancy import VacancyDBSchema
from src.other.schemas.contact import ContactGroupSchema
from src.portfolio.schemas.portfolio import MainPortfolioSchema


class ActivityRequestASchema(ActivityRequestSSchema):
    activity: ActivityDBSchema


class FullGroupSchema(GroupSchema):
    users: List[GroupUser2Schema]
    contacts: List[ContactGroupSchema]
    vacancies: List[VacancyDBSchema]
    activities: List[ActivitySchema]
    requests: List[ActivityRequestASchema]
    portfolios: List[MainPortfolioSchema]

    class Config:
        from_attributes = True
