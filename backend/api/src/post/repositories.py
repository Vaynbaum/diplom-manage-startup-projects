from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import case, or_, select

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class IPostRepository(GenericRepository[Post], ABC):
    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[Post]:
        raise NotImplementedError()

    @abstractmethod
    async def get_all(
        self,
        offset: int,
        limit: int,
        tag_ids: list[int],
        ids: list[int] | None = None,
        type_ids: list[int] | None = None,
        **filters,
    ) -> List[Post]:
        raise NotImplementedError()


class PostRepository(GenericSqlRepository[Post], IPostRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Post)

    async def get_all(
        self,
        offset: int,
        limit: int,
        tag_ids: list[int] | None,
        ids: list[int] | None = None,
        type_ids: list[int] | None = None,
        **filters,
    ) -> List[Post]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        stmt = stmt.options(
            selectinload(Post.type),
            selectinload(Post.user).selectinload(User.user_abstract),
            selectinload(Post.group),
            selectinload(Post.activity),
            selectinload(Post.tags).selectinload(TagPost.tag),
            selectinload(Post.likes),
        )
        if ids:
            stmt = stmt.where(Post.id.in_(ids))
            stmt = stmt.order_by(
                case([(Post.id == id, index) for index, id in enumerate(ids)])
            )
        else:
            stmt = stmt.order_by(Post.created_at.desc())

        if type_ids:
            ar = []
            for id in type_ids:
                ar.append(Post.type_id == id)
            stmt = stmt.where(or_(*ar))

        if tag_ids:
            posts = select(TagPost.post_id).distinct(TagPost.post_id)
            for id in tag_ids:
                sub = self._constructor_subquery(TagPost, tag_id=id)
                posts = posts.join(sub, sub.c.post_id == TagPost.post_id)
            stmt = stmt.where(Post.id.in_(posts))

        return await self._execute_statement_get_all(stmt)

    async def get_by_id(self, id: int) -> Optional[Post]:
        stmt = self._construct_statement_get_by_id(id)
        stmt = stmt.options(
            selectinload(Post.type),
            selectinload(Post.user).selectinload(User.user_abstract),
            selectinload(Post.group),
            selectinload(Post.activity),
            selectinload(Post.tags).selectinload(TagPost.tag),
            selectinload(Post.likes),
        )
        return await self._execute_statement_get_by_id(stmt, id)


class IPostLikeRepository(GenericRepository[PostLike], ABC):
    pass


class PostLikeRepository(GenericSqlRepository[PostLike], IPostLikeRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, PostLike)


class IPostTypeRepository(ISimpleRepository[PostType], ABC):
    pass


class PostTypeRepository(SimpleRepository[PostType], IPostTypeRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, PostType)
