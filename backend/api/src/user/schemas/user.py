from typing import List

from src.group.schemas.group2_user import Group2UserSchema
from src.group.schemas.group_invite import GroupInviteWithGroupSchema
from src.group.schemas.vacancy_vacancy_user import Vacancy2UserSchema
from src.other.schemas import CityShortSchema
from src.portfolio.schemas.portfolio import MainPortfolioSchema
from src.tag.schemas.tag_user import TagUserSchema
from src.user.schemas.user_db import UserDBSchema
from src.other.schemas.contact import ContactUserSchema
from src.user.schemas.subscription import *


class UserSchema(UserDBSchema):
    city: CityShortSchema | None = None
    groups: List[Group2UserSchema]
    subscribers: List[SubscriptionSSchema]
    favorites: List[SubscriptionFSchema]
    tags: List[TagUserSchema]
    contacts: List[ContactUserSchema]
    portfolios: List[MainPortfolioSchema]
    my_vacancies: List[Vacancy2UserSchema]
    invites: List[GroupInviteWithGroupSchema]

    class Config:
        from_attributes = True
