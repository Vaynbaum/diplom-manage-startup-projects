from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class ActivityRequestStatusSchema(sqlalchemy_to_pydantic(RequestStatus)):
    class Config:
        from_attributes = True


class ActivityRequestDBSchema(sqlalchemy_to_pydantic(ActivityRequest)):
    class Config:
        from_attributes = True


class ActivityRequestSSchema(ActivityRequestDBSchema):
    status: ActivityRequestStatusSchema

    class Config:
        from_attributes = True


