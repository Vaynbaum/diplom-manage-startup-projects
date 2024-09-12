from abc import ABC, abstractmethod
from typing import Callable
from sqlalchemy.ext.asyncio import AsyncSession

from src.activity.repositories import *
from src.group.repositories import *
from src.message.repositories import *


class IUnitOfWork(ABC):
    activities: IActivityRepository
    group_users: IGroupUserRepository
    messages: IMessageRepository

    @abstractmethod
    async def __aenter__(self): ...

    @abstractmethod
    async def __aexit__(self): ...

    @abstractmethod
    async def commit(self):
        raise NotImplementedError()

    @abstractmethod
    async def rollback(self):
        raise NotImplementedError()


class UnitOfWork(IUnitOfWork):
    def __init__(self, session_maker: Callable[[], AsyncSession]):
        self.__session_maker = session_maker

    async def __aenter__(self):
        self.__session: AsyncSession = self.__session_maker()
        self.activities = ActivityRepository(self.__session)
        self.group_users = GroupUserRepository(self.__session)
        self.messages = MessageRepository(self.__session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await self.rollback()
        await self.__session.close()

    async def commit(self):
        await self.__session.commit()

    async def rollback(self):
        await self.__session.rollback()
