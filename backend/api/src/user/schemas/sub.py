from pydantic import BaseModel, Field


class SubSchema(BaseModel):
    favorite_id: int = Field(gt=0)
