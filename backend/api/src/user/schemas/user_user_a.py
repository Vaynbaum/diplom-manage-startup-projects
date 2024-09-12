from typing import List
from src.other.schemas.city import CityShortSchema
from src.user.schemas.subscription import SubscriptionFSchema, SubscriptionSSchema
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_db import UserDBSchema


class ShortUserWithUserAbstractSchema(UserDBSchema):
    city: CityShortSchema | None = None
    subscribers: List[SubscriptionSSchema]
    favorites: List[SubscriptionFSchema]
    user_abstract: UserAbstractDBSchema

    class Config:
        from_attributes = True
