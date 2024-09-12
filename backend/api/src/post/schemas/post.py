from typing import List
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.activity.schemas.activity import ActivityDBSchema
from src.group.schemas.group import GroupDBSchema
from src.database.models import *
from src.tag.schemas.tag import TagSchema
from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_with_user_abstract import UserWithUserAbstractSchema


class PostTypeSchema(sqlalchemy_to_pydantic(PostType)):
    class Config:
        from_attributes = True


class PostLikeSchema(sqlalchemy_to_pydantic(PostLike)):
    class Config:
        from_attributes = True


class PostTagSchema(sqlalchemy_to_pydantic(TagPost)):
    tag_id: int | None
    post_id: int | None
    tag: TagSchema

    class Config:
        from_attributes = True


class PostDBSchema(sqlalchemy_to_pydantic(Post)):
    text: str | None = None
    user_id: int | None = None
    activity_id: int | None = None
    group_id: int | None = None

    class Config:
        from_attributes = True


class FullPostSchema(PostDBSchema):
    type: PostTypeSchema
    group: GroupDBSchema | None = None
    activity: ActivityDBSchema | None = None
    user: UserWithUserAbstractSchema | UserAbstractDBSchema | None = None
    tags: List[PostTagSchema] = []
    cnt_like: int | None = 0
    likes: List[PostLikeSchema] = []

    class Config:
        from_attributes = True
