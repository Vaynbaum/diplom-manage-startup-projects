from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class IActivityRepository(GenericRepository[Activity], ABC):
    @abstractmethod
    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        substr: str | None = None,
        **filters
    ) -> List[Activity]:
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[Activity]:
        raise NotImplementedError()


class ActivityRepository(GenericSqlRepository[Activity], IActivityRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Activity)

    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        substr: str | None = None,
        **filters
    ) -> List[Activity]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = self._add_substr_to_stmt(stmt, Activity.name, substr)
        stmt = stmt.order_by(Activity.name)
        stmt = stmt.options(selectinload(Activity.status))
        return await self._execute_statement_get_all(stmt)

    async def get_by_id(self, id: int) -> Optional[Activity]:
        stmt = self._construct_statement_get_by_id(id)
        stmt = stmt.options(
            selectinload(Activity.status),
            selectinload(Activity.group).selectinload(Group.type),
            selectinload(Activity.group)
            .selectinload(Group.users)
            .selectinload(GroupUser.user)
            .selectinload(User.user_abstract),
            selectinload(Activity.creater).selectinload(User.user_abstract),
        )
        return await self._execute_statement_get_by_id(stmt, id)
