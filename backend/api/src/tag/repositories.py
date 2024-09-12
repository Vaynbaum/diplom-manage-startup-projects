from abc import ABC, abstractmethod
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List
from sqlalchemy import func

from src.database.models import *
from src.database.repositories import GenericSqlRepository, GenericRepository


class ITagRepository(GenericRepository[Tag], ABC):
    @abstractmethod
    async def get_all(
        self,
        limit: int,
        offset: int,
        substr: str | None,
        ids: list[int] | None,
        to_user: bool,
        to_group: bool,
        to_activity: bool,
        to_post: bool,
    ) -> List[Tag]:
        raise NotImplementedError()


class TagRepository(GenericSqlRepository[Tag], ITagRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Tag)

    async def get_all(
        self,
        limit: int,
        offset: int,
        substr: str | None,
        ids: list[int] | None,
        to_user: bool,
        to_group: bool,
        to_activity: bool,
        to_post: bool,
    ):
        stmt = self._construct_statement_get_all()
        stmt = self._add_limit_offset_to_stmt(stmt, limit, offset)
        stmt = stmt.options().order_by(Tag.name)
        stmt = self._add_substr_to_stmt(stmt, Tag.name, substr)

        if ids:
            if to_post:
                posts = select(TagPost.post_id).distinct(TagPost.post_id)
                for id in ids:
                    sub = self._constructor_subquery(TagPost, tag_id=id)
                    posts = posts.join(sub, sub.c.post_id == TagPost.post_id)
                tags = select(TagPost.tag_id).where(TagPost.post_id.in_(posts))
                stmt = stmt.where(Tag.id.in_(tags))

            if to_user:
                users = select(TagUser.user_id).distinct(TagUser.user_id)
                portfolios = select(TagPortfolio.portfolio_id).distinct(
                    TagPortfolio.portfolio_id
                )
                for id in ids:
                    sub = self._constructor_subquery(TagUser, tag_id=id)
                    users = users.join(sub, sub.c.user_id == TagUser.user_id)

                    sub_p = self._constructor_subquery(TagPortfolio, tag_id=id)
                    portfolios = portfolios.join(
                        sub_p, sub_p.c.portfolio_id == TagPortfolio.portfolio_id
                    )

                tags = select(TagUser.tag_id).where(TagUser.user_id.in_(users))
                p_tags = select(TagPortfolio.tag_id).where(
                    TagPortfolio.portfolio_id.in_(portfolios)
                )
                stmt = stmt.where(or_(Tag.id.in_(tags), Tag.id.in_(p_tags)))

            if to_activity:
                activities = select(TagActivity.activity_id).distinct(
                    TagActivity.activity_id
                )
                portfolios = select(TagPortfolio.portfolio_id).distinct(
                    TagPortfolio.portfolio_id
                )
                for id in ids:
                    sub = self._constructor_subquery(TagActivity, tag_id=id)
                    activities = activities.join(
                        sub, sub.c.activity_id == TagActivity.activity_id
                    )

                    sub_p = self._constructor_subquery(TagPortfolio, tag_id=id)
                    portfolios = portfolios.join(
                        sub_p, sub_p.c.portfolio_id == TagPortfolio.portfolio_id
                    )

                tags = select(TagActivity.tag_id).where(
                    TagActivity.activity_id.in_(activities)
                )
                p_tags = select(TagPortfolio.tag_id).where(
                    TagPortfolio.portfolio_id.in_(portfolios)
                )
                stmt = stmt.where(or_(Tag.id.in_(tags), Tag.id.in_(p_tags)))

            if to_group:
                portfolios = select(TagPortfolio.portfolio_id).distinct(
                    TagPortfolio.portfolio_id
                )
                vacancies = select(TagVacancy.vacancy_id).distinct(
                    TagVacancy.vacancy_id
                )
                activities = select(TagActivity.activity_id).distinct(
                    TagActivity.activity_id
                )

                for id in ids:
                    sub_p = self._constructor_subquery(TagPortfolio, tag_id=id)
                    portfolios = portfolios.join(
                        sub_p, sub_p.c.portfolio_id == TagPortfolio.portfolio_id
                    )

                    sub_v = self._constructor_subquery(TagVacancy, tag_id=id)
                    vacancies = vacancies.join(
                        sub_v, sub_v.c.vacancy_id == TagVacancy.vacancy_id
                    )

                    sub_a = self._constructor_subquery(TagActivity, tag_id=id)
                    activities = vacancies.join(
                        sub_a, sub_a.c.activity_id == TagActivity.activity_id
                    )

                p_tags = select(TagPortfolio.tag_id).where(
                    TagPortfolio.portfolio_id.in_(portfolios)
                )
                v_tags = select(TagVacancy.tag_id).where(
                    TagVacancy.vacancy_id.in_(vacancies)
                )
                a_tags = select(TagActivity.tag_id).where(
                    TagActivity.activity_id.in_(activities)
                )
                stmt = stmt.where(
                    or_(Tag.id.in_(v_tags), Tag.id.in_(p_tags), Tag.id.in_(a_tags))
                )

            for id in ids:
                stmt = stmt.where(Tag.id != id)
        return await self._execute_statement_get_all(stmt)


class ITagUserLinkRepository(GenericRepository[TagUser], ABC):
    @abstractmethod
    async def get_top(self, limit: int = 10, **filters) -> List[TagUser]:
        raise NotImplementedError()


class TagUserLinkRepository(GenericSqlRepository[TagUser], ITagUserLinkRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagUser)

    async def get_top(self, limit: int = 10, **filters) -> List[TagUser]:
        stmt = self._construct_statement_get_all(**filters)
        stmt = stmt.options(selectinload(TagUser.tag))

        sub = select(TagUser.tag_id).group_by(TagUser.tag_id)
        sub = sub.order_by(func.count(TagUser.tag_id).desc()).limit(limit)

        stmt = stmt.where(TagUser.tag_id.in_(sub)).order_by(TagUser.tag_id)
        return await self._execute_statement_get_all(stmt)


class ITagLevelRepository(GenericRepository[TagLevel], ABC):
    pass


class TagLevelRepository(GenericSqlRepository[TagLevel], ITagLevelRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagLevel)


class ITagActivityLinkRepository(GenericRepository[TagActivity], ABC):
    @abstractmethod
    async def get_top(self, limit: int = 10, **filters) -> List[TagActivity]:
        raise NotImplementedError()


class TagActivityLinkRepository(
    GenericSqlRepository[TagActivity], ITagActivityLinkRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagActivity)

    async def get_top(self, limit: int = 10, **filters) -> List[TagActivity]:
        stmt = self._construct_statement_get_all(**filters)
        stmt = stmt.options(selectinload(TagActivity.tag))

        sub = select(TagActivity.tag_id).group_by(TagActivity.tag_id)
        sub = sub.order_by(func.count(TagActivity.tag_id).desc()).limit(limit)

        stmt = stmt.where(TagActivity.tag_id.in_(sub)).order_by(TagActivity.tag_id)
        return await self._execute_statement_get_all(stmt)


class ITagVacancyLinkRepository(GenericRepository[TagVacancy], ABC):
    @abstractmethod
    async def get_top(self, limit: int = 10, **filters) -> List[TagVacancy]:
        raise NotImplementedError()


class TagVacancyLinkRepository(
    GenericSqlRepository[TagVacancy], ITagVacancyLinkRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagVacancy)

    async def get_top(self, limit: int = 10, **filters) -> List[TagVacancy]:
        stmt = self._construct_statement_get_all(**filters)
        stmt = stmt.options(selectinload(TagVacancy.tag))

        sub = select(TagVacancy.tag_id).group_by(TagVacancy.tag_id)
        sub = sub.order_by(func.count(TagVacancy.tag_id).desc()).limit(limit)

        stmt = stmt.where(TagVacancy.tag_id.in_(sub)).order_by(TagVacancy.tag_id)
        return await self._execute_statement_get_all(stmt)


class IPostTagLinkRepository(GenericRepository[TagPost], ABC):
    @abstractmethod
    async def get_top(self, limit: int = 10, **filters) -> List[TagPost]:
        raise NotImplementedError()


class PostTagLinkRepository(GenericSqlRepository[TagPost], IPostTagLinkRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagPost)

    async def get_top(self, limit: int = 10, **filters) -> List[TagPost]:
        stmt = self._construct_statement_get_all(**filters)
        stmt = stmt.options(selectinload(TagPost.tag))

        sub = select(TagPost.tag_id).group_by(TagPost.tag_id)
        sub = sub.order_by(func.count(TagPost.tag_id).desc()).limit(limit)

        stmt = stmt.where(TagPost.tag_id.in_(sub)).order_by(TagPost.tag_id)
        return await self._execute_statement_get_all(stmt)


class IPortfolioTagLinkRepository(GenericRepository[TagPortfolio], ABC):
    pass


class PortfolioTagLinkRepository(
    GenericSqlRepository[TagPortfolio], IPortfolioTagLinkRepository
):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, TagPortfolio)
