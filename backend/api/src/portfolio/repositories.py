from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.repositories.generic import GenericRepository
from src.database.repositories.generic_sqlalchemy import GenericSqlRepository


class IPortfolioTypeRepository(GenericRepository[PortfolioType], ABC):
    @abstractmethod
    async def get_all(self) -> List[PortfolioType]:
        raise NotImplementedError()


class PortfolioTypeRepository(
    GenericSqlRepository[PortfolioType], IPortfolioTypeRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, PortfolioType)

    async def get_all(self) -> List[PortfolioType]:
        stmt = self._construct_statement_get_all()
        stmt = stmt.order_by(PortfolioType.id)
        return await self._execute_statement_get_all(stmt)


class IPortfolioRepository(GenericRepository[Portfolio]):
    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[Portfolio]:
        raise NotImplementedError()


class PortfolioRepository(GenericSqlRepository[Portfolio], IPortfolioRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Portfolio)

    async def get_by_id(self, id: int) -> Optional[Portfolio]:
        stmt = self._construct_statement_get_by_id(id)
        stmt = stmt.options(
            selectinload(Portfolio.type),
            selectinload(Portfolio.group),
            selectinload(Portfolio.activity),
            selectinload(Portfolio.tags).selectinload(TagPortfolio.tag),
        )
        return await self._execute_statement_get_by_id(stmt, id)
