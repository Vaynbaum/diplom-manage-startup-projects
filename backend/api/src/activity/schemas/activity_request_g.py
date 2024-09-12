from src.activity.schemas.activity_request import ActivityRequestSSchema
from src.group.schemas.group import GroupDBSchema


class ActivityRequestGSchema(ActivityRequestSSchema):
    group: GroupDBSchema

    class Config:
        from_attributes = True
