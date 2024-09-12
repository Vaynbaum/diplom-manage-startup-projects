from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.repositories import GenericSqlRepository, GenericRepository


class IMessageRepository(GenericRepository[MessageModel], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[MessageModel]:
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[MessageModel]:
        raise NotImplementedError()


class MessageRepository(GenericSqlRepository[MessageModel], IMessageRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, MessageModel)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[MessageModel]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.order_by(MessageModel.created_at.desc())
        stmt = stmt.options(
            selectinload(MessageModel.sender).selectinload(User.user_abstract)
        )
        return await self._execute_statement_get_all(stmt)

    async def get_by_id(self, id: int) -> Optional[MessageModel]:
        stmt = self._construct_statement_get_by_id(id)
        stmt = stmt.options(
            selectinload(MessageModel.sender).selectinload(User.user_abstract)
        )
        return await self._execute_statement_get_by_id(stmt, id)
