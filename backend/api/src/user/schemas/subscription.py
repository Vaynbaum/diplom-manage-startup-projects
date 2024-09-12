from pydantic import Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class SubscriptionDBSchema(sqlalchemy_to_pydantic(Subscription)):
    subscriber_id: int = Field(..., exclude=True)
    favorite_id: int = Field(..., exclude=True)

    class Config:
        from_attributes = True


class SubscriptionSSchema(SubscriptionDBSchema):
    subscriber: UserAbstractDBSchema | UserWithUserAbstractSchema

    class Config:
        from_attributes = True


class SubscriptionFSchema(SubscriptionDBSchema):
    favorite: UserAbstractDBSchema | UserWithUserAbstractSchema

    class Config:
        from_attributes = True
