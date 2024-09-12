from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, case, or_, select

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class IGroupRepository(GenericRepository[Group], ABC):
    @abstractmethod
    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        type_ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        is_vac: bool = False,
        is_act: bool = False,
        created_at_order: bool = False,
        **filters
    ) -> List[Group]:
        raise NotImplementedError()

    @abstractmethod
    async def get_one_short(
        self, id: int | None, username: str | None = None
    ) -> Optional[Group]:
        raise NotImplementedError()

    @abstractmethod
    async def get_one(self, id: int | None, username: str | None) -> Optional[Group]:
        raise NotImplementedError()


class GroupRepository(GenericSqlRepository[Group], IGroupRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Group)

    async def get_one_short(
        self, id: int | None, username: str | None = None
    ) -> Optional[Group]:
        stmt = self._construct_statement_get_one(id=id, username=username)
        return await self._execute_statement_get_one(stmt)

    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        type_ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        is_vac: bool = False,
        is_act: bool = False,
        created_at_order: bool = False,
        **filters
    ) -> List[Group]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.options(selectinload(Group.type), selectinload(Group.users))
        if ids:
            stmt = stmt.where(Group.id.in_(ids))
            stmt = stmt.order_by(
                case([(Group.id == id, index) for index, id in enumerate(ids)])
            )
        else:
            if created_at_order:
                stmt = stmt.order_by(Group.created_at)
            else:
                stmt = stmt.order_by(Group.name)

        if type_ids:
            ar = []
            for type_id in type_ids:
                ar.append(Group.type_id == type_id)
            stmt = stmt.where(or_(*ar))
        if is_vac:
            s = select(Vacancy.group_id).distinct(Vacancy.group_id)
            stmt = stmt.where(Group.id.in_(s))
        if is_act:
            s = select(Activity.group_id).distinct(Activity.group_id)
            stmt = stmt.where(Group.id.in_(s))
        if tag_ids is not None:
            arr = []
            arr_act = []
            arr_vac = []

            for id in tag_ids:
                arr.append(TagPortfolio.tag_id == id)
                arr_act.append(TagActivity.tag_id == id)
                arr_vac.append(TagVacancy.tag_id == id)

            s = select(TagPortfolio.portfolio_id).distinct(TagPortfolio.portfolio_id)
            portfolios = s.where(or_(*arr))
            sub_port = select(Portfolio.group_id).where(Portfolio.id.in_(portfolios))

            s = select(TagActivity.activity_id).distinct(TagActivity.activity_id)
            activities = s.where(or_(*arr_act))
            sub_activity = select(Activity.group_id).where(Activity.id.in_(activities))

            s = select(TagVacancy.vacancy_id).distinct(TagVacancy.vacancy_id)
            vacancies = s.where(or_(*arr_vac))
            sub_vac = select(Vacancy.group_id).where(
                and_(Vacancy.is_active, Vacancy.id.in_(vacancies))
            )

            stmt = stmt.where(
                or_(
                    Group.id.in_(sub_port),
                    Group.id.in_(sub_activity),
                    Group.id.in_(sub_vac),
                )
            )

        return await self._execute_statement_get_all(stmt)

    async def get_one(
        self, id: int | None, username: str | None = None
    ) -> Optional[Group]:
        stmt = self._construct_statement_get_one(id=id, username=username)
        stmt = stmt.options(
            selectinload(Group.type),
            selectinload(Group.users)
            .selectinload(GroupUser.user)
            .selectinload(User.user_abstract),
            selectinload(Group.users).selectinload(GroupUser.role),
            selectinload(Group.contacts).selectinload(ContactGroup.contact),
            selectinload(Group.vacancies),
            selectinload(Group.activities).selectinload(Activity.status),
            selectinload(Group.activities).selectinload(Activity.direction),
            selectinload(Group.requests).selectinload(ActivityRequest.status),
            selectinload(Group.requests).selectinload(ActivityRequest.activity),
            selectinload(Group.portfolios).selectinload(Portfolio.type),
            selectinload(Group.portfolios)
            .selectinload(Portfolio.tags)
            .selectinload(TagPortfolio.tag),
        )
        return await self._execute_statement_get_one(stmt)


class IGroupTypeRepository(ISimpleRepository[GroupType], ABC):
    pass


class GroupTypeRepository(SimpleRepository[GroupType], IGroupTypeRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GroupType)


class IGroupUserRepository(GenericRepository[GroupUser], ABC):
    pass


class GroupUserRepository(GenericSqlRepository[GroupUser], IGroupUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GroupUser)


class IGroupRoleRepository(GenericRepository[GroupRole], ABC):
    @abstractmethod
    async def get_all(self, group_id: int) -> List[GroupRole]:
        raise NotImplementedError()


class GroupRoleRepository(GenericSqlRepository[GroupRole], IGroupRoleRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GroupRole)

    async def get_all(self, group_id: int, is_common: bool) -> List[GroupRole]:
        stmt = self._construct_list_stmt(
            group_id=group_id, is_common=is_common, link=or_
        )
        stmt = stmt.order_by(GroupRole.name)
        return await self._execute_statement_get_all(stmt)


# Contact
class IContactGroupRepository(GenericRepository[ContactGroup], ABC):
    pass


class ContactGroupRepository(
    GenericSqlRepository[ContactGroup], IContactGroupRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ContactGroup)


# Vacancy
class IVacancyRepository(GenericRepository[Vacancy], ABC):
    @abstractmethod
    async def get_one(self, id: int) -> Optional[Vacancy]:
        raise NotImplementedError()


class VacancyRepository(GenericSqlRepository[Vacancy], IVacancyRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Vacancy)

    async def get_one(self, id: int) -> Optional[Vacancy]:
        stmt = self._construct_statement_get_one(id=id)
        stmt = stmt.options(
            selectinload(Vacancy.tags).selectinload(TagVacancy.tag),
            selectinload(Vacancy.tags).selectinload(TagVacancy.level),
            selectinload(Vacancy.users),
        )
        return await self._execute_statement_get_one(stmt)


class IVacancyUserRepository(GenericRepository[VacancyUser], ABC):
    @abstractmethod
    async def get_all_by_vac(
        self, vacancy_id: int, limit: int, offset: int
    ) -> List[VacancyUser]:
        raise NotImplementedError()


class VacancyUserRepository(GenericSqlRepository[VacancyUser], IVacancyUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, VacancyUser)

    async def get_all_by_vac(
        self, vacancy_id: int, limit: int, offset: int
    ) -> List[VacancyUser]:
        stmt = self._construct_statement_get_all(vacancy_id=vacancy_id)
        stmt = self._add_limit_offset_to_stmt(stmt, limit, offset).order_by(
            VacancyUser.is_approved.desc(), VacancyUser.created_at.desc()
        )
        stmt = stmt.options(
            selectinload(VacancyUser.user).selectinload(User.user_abstract)
        )
        return await self._execute_statement_get_all(stmt)


class IGroupInviteRepository(GenericRepository[GroupInvite], ABC):
    pass


class GroupInviteRepository(GenericSqlRepository[GroupInvite], IGroupInviteRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GroupInvite)
