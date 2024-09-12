from abc import ABC, abstractmethod
from datetime import date, datetime
from sqlalchemy import case, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.repositories import GenericSqlRepository, GenericRepository
from src.database.exceptions import *
from src.user.exceptions import *


# Role
class IRoleRepository(GenericRepository[Role], ABC):
    pass


class RoleRepository(GenericSqlRepository[Role], IRoleRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Role)


# UserAbstract
class IUserAbstractRepository(GenericRepository[UserAbstract], ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[UserAbstract]:
        raise NotImplementedError()

    @abstractmethod
    async def get_one_short(
        self, id: int | None, username: str | None = None
    ) -> Optional[UserAbstract]:
        raise NotImplementedError()

    @abstractmethod
    async def get_one(
        self, id: int | None, username: str | None = None
    ) -> Optional[UserAbstract]:
        raise NotImplementedError()


class UserAbstractRepository(
    GenericSqlRepository[UserAbstract], IUserAbstractRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, UserAbstract)

    async def get_one_short(
        self, id: int | None, username: str | None = None
    ) -> Optional[UserAbstract]:
        stmt = self._construct_statement_get_one(id=id, username=username)
        stmt = stmt.options(
            selectinload(UserAbstract.role),
            selectinload(UserAbstract.user).selectinload(User.city),
        )
        return await self._execute_statement_get_one(stmt)

    async def get_one(
        self, id: int | None, username: str | None = None
    ) -> Optional[UserAbstract]:
        stmt = self._construct_statement_get_one(id=id, username=username)
        stmt = stmt.options(
            selectinload(UserAbstract.role),
            selectinload(UserAbstract.admin),
            selectinload(UserAbstract.user).selectinload(User.city),
            selectinload(UserAbstract.user)
            .selectinload(User.groups)
            .selectinload(GroupUser.group),
            selectinload(UserAbstract.user)
            .selectinload(User.groups)
            .selectinload(GroupUser.group)
            .selectinload(Group.type),
            selectinload(UserAbstract.user)
            .selectinload(User.contacts)
            .selectinload(ContactUser.contact),
            selectinload(UserAbstract.user)
            .selectinload(User.tags)
            .selectinload(TagUser.tag),
            selectinload(UserAbstract.user)
            .selectinload(User.tags)
            .selectinload(TagUser.level),
            selectinload(UserAbstract.user)
            .selectinload(User.subscribers)
            .selectinload(Subscription.subscriber)
            .selectinload(User.user_abstract),
            selectinload(UserAbstract.user)
            .selectinload(User.favorites)
            .selectinload(Subscription.favorite)
            .selectinload(User.user_abstract),
            selectinload(UserAbstract.user)
            .selectinload(User.portfolios)
            .selectinload(Portfolio.type),
            selectinload(UserAbstract.user)
            .selectinload(User.portfolios)
            .selectinload(Portfolio.tags)
            .selectinload(TagPortfolio.tag),
            selectinload(UserAbstract.user)
            .selectinload(User.invites)
            .selectinload(GroupInvite.group),
            selectinload(UserAbstract.user)
            .selectinload(User.my_vacancies)
            .selectinload(VacancyUser.vacancy)
            .selectinload(Vacancy.group),
        )
        return await self._execute_statement_get_one(stmt)

    async def get_by_email(self, email: str) -> Optional[UserAbstract]:
        try:
            stmt = self._construct_statement_get_one(email=email)
            return await self._execute_statement_get_one(stmt)
        except GetOneItemException as e:
            raise GetUserByEmailException(email) from e


# User
class IUserRepository(GenericRepository[User], ABC):
    @abstractmethod
    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        min_age: int | None = None,
        max_age: int | None = None,
        **filters
    ) -> List[User]:
        raise NotImplementedError()


class UserRepository(GenericSqlRepository[User], IUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, User)

    async def get_all(
        self,
        offset: int | None = None,
        limit: int | None = None,
        ids: list[int] | None = None,
        tag_ids: list[int] | None = None,
        min_age: int | None = None,
        max_age: int | None = None,
        **filters
    ) -> List[User]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.options(
            selectinload(User.user_abstract),
            selectinload(User.city),
            selectinload(User.subscribers)
            .selectinload(Subscription.subscriber)
            .selectinload(User.user_abstract),
            selectinload(User.favorites)
            .selectinload(Subscription.favorite)
            .selectinload(User.user_abstract),
        )
        stmt = self._join_tables(stmt, [UserAbstract])
        if ids:
            stmt = stmt.where(User.id.in_(ids))
            stmt = stmt.order_by(
                case([(User.id == id, index) for index, id in enumerate(ids)])
            )
        else:
            stmt = stmt.order_by(UserAbstract.lastname, UserAbstract.firstname)

        if min_age and max_age:
            today = date.today()
            min_birth_date = today.replace(year=today.year - 1 - max_age)
            max_birth_date = today.replace(year=today.year - min_age)
            stmt = stmt.where(
                User.birthdate > min_birth_date, User.birthdate <= max_birth_date
            )

        if tag_ids is not None:
            users = select(TagUser.user_id).distinct(TagUser.user_id)
            arr = []

            for id in tag_ids:
                sub = self._constructor_subquery(TagUser, tag_id=id)
                users = users.join(sub, sub.c.user_id == TagUser.user_id)

                arr.append(TagPortfolio.tag_id == id)

            portfolios = select(TagPortfolio.portfolio_id).where(or_(*arr))
            sub_portfolio = select(Portfolio.user_id).where(
                Portfolio.id.in_(portfolios)
            )
            stmt = stmt.where(or_(User.id.in_(users), User.id.in_(sub_portfolio)))

        stmt = self._filter_table(stmt, UserAbstract, is_active=True)

        return await self._execute_statement_get_all(stmt)


class ISubscriptionRepository(GenericRepository[Subscription], ABC):
    pass


class SubscriptionRepository(
    GenericSqlRepository[Subscription], ISubscriptionRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Subscription)


# Contact
class IContactUserRepository(GenericRepository[ContactUser], ABC):
    pass


class ContactUserRepository(GenericSqlRepository[ContactUser], IContactUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ContactUser)
