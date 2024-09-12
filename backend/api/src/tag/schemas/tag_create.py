from pydantic import BaseModel


class SimpleTagCreateId(BaseModel):
    tag_id: int | None = None


class TagCreateIdSchema(SimpleTagCreateId):
    level_id: int


class SimpleTagCreateName(BaseModel):
    tag_name: str | None = None


class TagCreateNameSchema(SimpleTagCreateName):
    level_id: int
