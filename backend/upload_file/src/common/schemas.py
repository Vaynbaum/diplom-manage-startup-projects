from pydantic import BaseModel
from typing import Generic, TypeVar, List
from pydantic.generics import GenericModel


class MessageSchema(BaseModel):
    message: str


Item = TypeVar("Item")


class ResponseItemsSchema(GenericModel, Generic[Item]):
    items: List[Item]
    count: int
    offset: int | None = None

    @staticmethod
    def Of(items: list[Item], offset: int | None = None, l: int | None = None):
        return ResponseItemsSchema[Item](
            items=items, count=l if l else len(items), offset=offset
        )
