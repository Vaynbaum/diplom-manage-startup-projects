from abc import ABC, abstractmethod
from typing import Optional
from redis import Redis

from src.database.models import *
from src.database.repositories import GenericRedisRepository, GenericRepository
from src.database.schemas import RecordRedisSchema


class IPasswordRecoveryRepository(GenericRepository[RecordRedisSchema], ABC):
    @abstractmethod
    async def pop(self, key: str) -> bytes:
        raise NotImplementedError()


class PasswordRecoveryRepository(
    GenericRedisRepository[RecordRedisSchema], IPasswordRecoveryRepository
):
    def __init__(self, redis_connect: Redis) -> None:
        super().__init__(redis_connect, RecordRedisSchema)

    async def pop(self, key: str) -> bytes:
        record = await self.get_by_id(key)
        await self.delete(key=key)
        return record


class IActivationRepository(GenericRepository[RecordRedisSchema], ABC):
    @abstractmethod
    async def pop(self, key: str) -> bytes:
        raise NotImplementedError()


class ActivationRepository(
    GenericRedisRepository[RecordRedisSchema], IActivationRepository
):
    def __init__(self, redis_connect: Redis) -> None:
        super().__init__(redis_connect, RecordRedisSchema)

    async def pop(self, key: str) -> bytes:
        record = await self.get_by_id(key)
        await self.delete(key=key)
        return record
