from pydantic import BaseModel, Field


class ActivityGroupSchema(BaseModel):
    group_id: int = Field(gt=0)
    activity_id: int = Field(gt=0)
