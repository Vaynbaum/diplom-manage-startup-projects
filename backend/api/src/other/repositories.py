from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy.orm import selectinload

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class ICityRepository(GenericRepository[City], ABC):
    @abstractmethod
    async def get_all(
        self, limit: int, offset: int, substr: str | None, region_id: int | None
    ) -> List[City]:
        raise NotImplementedError()


class CityRepository(GenericSqlRepository[City], ICityRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, City)

    async def get_all(
        self, limit: int, offset: int, substr: str | None, region_id: int | None
    ) -> List[City]:
        stmt = self._construct_statement_get_all()
        stmt = self._join_tables(stmt, [Region])
        if region_id:
            stmt = self._filter_table(stmt, Region, id=region_id)

        stmt = self._add_limit_offset_to_stmt(stmt, limit, offset)
        stmt = stmt.options(selectinload(City.region)).order_by(Region.name, City.name)
        stmt = self._add_substr_to_stmt(stmt, City.name, substr)

        return await self._execute_statement_get_all(stmt)


class IRegionRepository(ISimpleRepository[Region], ABC):
    pass


class RegionRepository(SimpleRepository[Region], IRegionRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Region)


class IContactRepository(GenericRepository[Contact], ABC):
    pass


class ContactRepository(GenericSqlRepository[Contact], IContactRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Contact)
