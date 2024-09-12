from pydantic import BaseModel


class TagQuerySchema(BaseModel):
    tag: int
    level: int | None = None
