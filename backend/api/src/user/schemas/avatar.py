from pydantic import BaseModel


class AvatarSchema(BaseModel):
    url: str | None = None
    id: int | None = None
