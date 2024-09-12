from abc import ABC, abstractmethod
from typing import Any, Generic, Type, TypeVar

from pydantic import BaseModel

from src.database.schemas import RecordRedisSchema

BT = TypeVar("BT")
ET = TypeVar("ET")


class BaseMapper(Generic[BT, ET], ABC):
    @abstractmethod
    def mapping(self, item: BT, **kwargs) -> ET:
        raise NotImplementedError()


class SimpleDBMapper(BaseMapper[BT, ET], ABC):
    def __init__(self, schema: BaseModel | Type[ET]):
        self._schema = schema

    def mapping(self, item: BT) -> ET:
        return self._schema.from_orm(item)


class RecordRedisInputMapper(BaseMapper[Any, RecordRedisSchema]):
    def mapping(self, item: Any, key: str, expire: int | None = None):
        return RecordRedisSchema(key=key, value=item, expire=expire)


class RecordRedisDBMapper(BaseMapper[RecordRedisSchema, Any]):
    def mapping(sellf, item: RecordRedisSchema):
        return item.value
