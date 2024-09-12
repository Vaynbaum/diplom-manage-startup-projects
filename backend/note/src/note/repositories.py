from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.repositories import GenericSqlRepository, GenericRepository


class INoteRepository(GenericRepository[Notification], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[Notification]:
        raise NotImplementedError()


class NoteRepository(GenericSqlRepository[Notification], INoteRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Notification)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[Notification]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.order_by(Notification.created_at.desc())
        return await self._execute_statement_get_all(stmt)
