from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, select
from sqlalchemy import case

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class IActivityRepository(GenericRepository[Activity], ABC):
    @abstractmethod
    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        status_id: int | None = None,
        direction_ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        is_group: bool = False,
        created_at_order: bool = False,
        **filters
    ) -> List[Activity]:
        raise NotImplementedError()

    @abstractmethod
    async def get_full_all(self, created_at_order: bool = False) -> List[Activity]:
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[Activity]:
        raise NotImplementedError()


class ActivityRepository(GenericSqlRepository[Activity], IActivityRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Activity)

    async def get_full_all(self, created_at_order: bool = False) -> List[Activity]:
        stmt = self._construct_statement_get_all()
        stmt = stmt.options(
            selectinload(Activity.status), selectinload(Activity.direction)
        )
        if created_at_order:
            stmt = stmt.order_by(Activity.created_at)
        else:
            stmt = stmt.order_by(Activity.name)
        return await self._execute_statement_get_all(stmt)

    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        status_ids: int | None = None,
        direction_ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        is_group: bool = False,
        created_at_order: bool = False,
        **filters
    ) -> List[Activity]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.options(
            selectinload(Activity.status), selectinload(Activity.direction)
        )
        if ids:
            stmt = stmt.where(Activity.id.in_(ids))
            stmt = stmt.order_by(
                case([(Activity.id == id, index) for index, id in enumerate(ids)])
            )
        else:
            if created_at_order:
                stmt = stmt.order_by(Activity.created_at)
            else:
                stmt = stmt.order_by(Activity.name)

        if status_ids:
            ar = []
            for status in status_ids:
                ar.append(Activity.status_id == status)
            stmt = stmt.where(or_(*ar))
        if direction_ids:
            ar = []
            for status in direction_ids:
                ar.append(Activity.direction_id == status)
            stmt = stmt.where(or_(*ar))
        if is_group:
            stmt = stmt.where(Activity.group_id != None)

        if tag_ids is not None:
            activities = select(TagActivity.activity_id).distinct(
                TagActivity.activity_id
            )
            arr = []

            for id in tag_ids:
                sub = self._constructor_subquery(TagActivity, tag_id=id)
                activities = activities.join(
                    sub, sub.c.activity_id == TagActivity.activity_id
                )

                arr.append(TagPortfolio.tag_id == id)

            portfolios = select(TagPortfolio.portfolio_id).where(or_(*arr))
            sub_portfolio = select(Portfolio.activity_id).where(
                Portfolio.id.in_(portfolios)
            )
            stmt = stmt.where(
                or_(Activity.id.in_(activities), Activity.id.in_(sub_portfolio))
            )

        return await self._execute_statement_get_all(stmt)

    async def get_by_id(self, id: int) -> Optional[Activity]:
        stmt = self._construct_statement_get_by_id(id)
        stmt = stmt.options(
            selectinload(Activity.status),
            selectinload(Activity.direction),
            selectinload(Activity.group).selectinload(Group.type),
            selectinload(Activity.group)
            .selectinload(Group.users)
            .selectinload(GroupUser.user)
            .selectinload(User.user_abstract),
            selectinload(Activity.creater).selectinload(User.user_abstract),
            selectinload(Activity.tags).selectinload(TagActivity.tag),
            selectinload(Activity.contacts).selectinload(ContactActivity.contact),
            selectinload(Activity.requests).selectinload(ActivityRequest.status),
            selectinload(Activity.requests).selectinload(ActivityRequest.group),
            selectinload(Activity.portfolios).selectinload(Portfolio.type),
            selectinload(Activity.portfolios)
            .selectinload(Portfolio.tags)
            .selectinload(TagPortfolio.tag),
        )
        return await self._execute_statement_get_by_id(stmt, id)


class IDirectionRepository(GenericRepository[Direction], ABC):
    pass


class DirectionRepository(SimpleRepository[Direction], IDirectionRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Direction)


class IActivityStatusRepository(GenericRepository[ActivityStatus], ABC):
    pass


class ActivityStatusRepository(
    GenericSqlRepository[ActivityStatus], IActivityStatusRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ActivityStatus)


# Contact
class IContactActivityRepository(GenericRepository[ContactActivity], ABC):
    pass


class ContactActivityRepository(
    GenericSqlRepository[ContactActivity], IContactActivityRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ContactActivity)


class IActivityRequestRepository(GenericRepository[ActivityRequest], ABC):
    pass


class ActivityRequestRepository(
    GenericSqlRepository[ActivityRequest], IActivityRequestRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ActivityRequest)


class IActivityTaskRepository(GenericRepository[ActivityTask], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[ActivityTask]:
        raise NotImplementedError()


class ActivityTaskRepository(
    GenericSqlRepository[ActivityTask], IActivityTaskRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ActivityTask)

    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[ActivityTask]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.order_by(ActivityTask.created_at.desc())
        stmt = stmt.options(
            selectinload(ActivityTask.status),
            selectinload(ActivityTask.users)
            .selectinload(ActivityTaskAssignment.user)
            .selectinload(User.user_abstract),
        )
        return await self._execute_statement_get_all(stmt)


class IActivityTaskAssignmentsRepository(
    GenericRepository[ActivityTaskAssignment], ABC
):
    @abstractmethod
    async def get_one(
        self, user_id: int, task_id: int = None, activity_id: int = None
    ) -> Optional[ActivityTaskAssignment]:
        raise NotImplementedError()

    @abstractmethod
    async def get_all(
        self,
        user_id: int,
        task_id: int = None,
        activity_id: int = None,
        offset: int | None = None,
        limit: int | None = None,
        **filters
    ) -> List[ActivityTaskAssignment]:
        raise NotImplementedError()


class ActivityTaskAssignmentsRepository(
    GenericSqlRepository[ActivityTaskAssignment], IActivityTaskAssignmentsRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ActivityTaskAssignment)

    async def get_one(
        self, user_id: int, task_id: int = None, activity_id: int = None
    ) -> Optional[ActivityTaskAssignment]:
        stmt = self._construct_statement_get_one(user_id=user_id, task_id=task_id)
        stmt = self._join_tables(stmt, [ActivityTask])
        if activity_id:
            stmt = self._filter_table(stmt, ActivityTask, activity_id=activity_id)
        return await self._execute_statement_get_one(stmt)

    async def get_all(
        self,
        user_id: int,
        task_id: int = None,
        activity_id: int = None,
        offset: int | None = None,
        limit: int | None = None,
        **filters
    ) -> List[ActivityTaskAssignment]:
        stmt = self._construct_statement_get_all(
            offset, limit, user_id=user_id, task_id=task_id, **filters
        )
        stmt = self._join_tables(stmt, [ActivityTask])
        if activity_id:
            stmt = self._filter_table(stmt, ActivityTask, activity_id=activity_id)
        return await self._execute_statement_get_all(stmt)


class IActivityTaskStatusRepository(GenericRepository[ActivityTaskStatus], ABC):
    pass


class ActivityTaskStatusRepository(
    GenericSqlRepository[ActivityTaskStatus], IActivityTaskStatusRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ActivityTaskStatus)
