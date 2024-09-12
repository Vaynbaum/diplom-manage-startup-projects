from pydantic import BaseModel, Field


class SubSchema(BaseModel):
    group_id: int = Field(gt=0)
