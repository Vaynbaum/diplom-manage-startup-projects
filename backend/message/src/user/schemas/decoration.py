from pydantic import BaseModel


class DecorationSchema(BaseModel):
    coverImage: str | None = None
    id: int | None = None
