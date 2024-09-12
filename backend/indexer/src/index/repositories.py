from abc import ABC, abstractmethod
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.repositories import *


class IActivityRepository(GenericRepository[Activity], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[Activity]:
        raise NotImplementedError()


class ActivityRepository(GenericSqlRepository[Activity], IActivityRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Activity)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[Activity]:
        stmt = self._construct_statement_get_all(offset, limit)
        stmt = stmt.options(
            selectinload(Activity.direction),
            selectinload(Activity.tags).selectinload(TagActivity.tag),
        )
        return await self._execute_statement_get_all(stmt)


class IGroupRepository(GenericRepository[Group], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[Group]:
        raise NotImplementedError()


class GroupRepository(GenericSqlRepository[Group], IGroupRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Group)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[Group]:
        stmt = self._construct_statement_get_all(offset, limit)
        return await self._execute_statement_get_all(stmt)


class IPostRepository(GenericRepository[Post], ABC):

    @abstractmethod
    async def get_all(self, offset: int, limit: int) -> List[Post]:
        raise NotImplementedError()


class PostRepository(GenericSqlRepository[Post], IPostRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Post)

    async def get_all(self, offset: int, limit: int) -> List[Post]:
        stmt = self._construct_statement_get_all(offset, limit)
        stmt = stmt.options(selectinload(Post.tags).selectinload(TagPost.tag))
        return await self._execute_statement_get_all(stmt)


class IUserRepository(GenericRepository[User], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[User]:
        raise NotImplementedError()


class UserRepository(GenericSqlRepository[User], IUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, User)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None
    ) -> List[User]:
        stmt = self._construct_statement_get_all(offset, limit)

        stmt = stmt.options(
            selectinload(User.user_abstract),
            selectinload(User.city),
            selectinload(User.tags).selectinload(TagUser.tag),
        )
        return await self._execute_statement_get_all(stmt)
