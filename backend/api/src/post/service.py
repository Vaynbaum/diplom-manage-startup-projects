from src.activity.phrases import *
from src.common.consts import RANK_FUSION_SCORE
from src.common.exceptions import *
from src.common.schemas import MessageSchema
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import *
from src.config import TypesenseCon
from src.database.exceptions import *
from src.group.phrases import GTYPES_EXCEPTION, GTYPES_NOT_FOUND
from src.post.consts import NAME_SCHEMA_POST
from src.post.mappers import *
from src.post.phrases import *
from src.post.schemas import *
from src.tag.mappers import TagInputMapper


class PostService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_types(self):
        async with self.__uow:
            try:
                types = await self.__uow.post_types.get_all()
                m = PTypeDBMapper()
                return process_items_from_db(types, GTYPES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(GTYPES_EXCEPTION) from e

    async def create_post(self, post: PostCreateSchema, id: int):
        async with self.__uow:
            try:
                post_db = PostInputMapper().mapping(post, id)
                post_db = await self.__uow.posts.add(post_db)
                await self.__uow.commit()
                post_db = await self.__uow.posts.get_by_id(post_db.id)

                m = PostTagLinkInputMapper()
                tm = TagInputMapper()
                rep = self.__uow.tag_posts

                await add_ids(
                    self.__uow, rep, post_db.id, post.tag_ids, m, post_id=post_db.id
                )
                await add_names(
                    self.__uow,
                    rep,
                    post_db.id,
                    post.tag_names,
                    m,
                    tm,
                    post_id=post_db.id,
                )
                id = post_db.id

            except ForeignKeyViolationException as e:
                raise BadRequestException(TAG_NO_EXIST)
            except AddItemException as e:
                raise AnyServiceException(ADD_POST_FAILED) from e

        async with self.__uow:
            try:
                new_post_db = await self.__uow.posts.get_by_id(id)
                return PostDBMapper().mapping(new_post_db)
            except GetItemByIdException as e:
                raise AnyServiceException(POST_UPD_GET_EXCEPTION) from e

    async def update_post(self, post: PostUpdateSchema):
        async with self.__uow:
            try:
                post_db = await self.__uow.posts.get_by_id(post.post_id)
                post_db = PostUpdInputMapper().mapping(post, post_db)
                arr_files = post_db.materials.get("files", [])
                arr_imgs = post_db.materials.get("images", [])
                post_db.materials = {}
                await self.__uow.posts.update(post_db)
                await self.__uow.commit()
            except GetItemByIdException as e:
                raise AnyServiceException(POST_UPD_GET_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(POST_UPD_EXCEPTION) from e
            try:
                am = FileInputMapper()

                if post.delete_file_ids:
                    arr_files = [
                        i for i in arr_files if i["id"] not in post.delete_file_ids
                    ]
                    arr_imgs = [
                        i for i in arr_imgs if i["id"] not in post.delete_file_ids
                    ]

                for file in post.files:
                    f = am.mapping(file)
                    abr = file.name.split(".")[-1]

                    if abr and abr in IMAGES:
                        arr_imgs.append(f)
                    else:
                        arr_files.append(f)

                post_db.materials = {"files": arr_files, "images": arr_imgs}
                await self.__uow.posts.update(post_db)
                await self.__uow.commit()

            except UpdateItemException as e:
                raise AnyServiceException(POST_UPD_EXCEPTION) from e
            try:
                for id in post.delete_tag_ids:
                    await self.__uow.tag_posts.delete(post_id=post_db.id, tag_id=id)
                await self.__uow.commit()

                m = PostTagLinkInputMapper()
                tm = TagInputMapper()
                rep = self.__uow.tag_posts

                await add_ids(
                    self.__uow, rep, post_db.id, post.tag_ids, m, post_id=post_db.id
                )
                await add_names(
                    self.__uow,
                    rep,
                    post_db.id,
                    post.tag_names,
                    m,
                    tm,
                    post_id=post_db.id,
                )
            except GetOneItemException as e:
                raise AnyServiceException(TAG_GET_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(TAG_NO_EXIST)
            except UpdateItemException as e:
                raise AnyServiceException(POST_UPD_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(POST_UPD_EXCEPTION) from e

        async with self.__uow:
            try:
                new_post_db = await self.__uow.posts.get_by_id(post.post_id)
                return PostDBMapper().mapping(new_post_db)
            except GetItemByIdException as e:
                raise AnyServiceException(POST_UPD_GET_EXCEPTION) from e

    async def delete_post(self, id: int):
        async with self.__uow:
            try:
                post_db = await self.__uow.posts.get_by_id(id)
                arr_files = post_db.materials.get("files", [])
                arr_imgs = post_db.materials.get("images", [])
                arr = [i["id"] for i in arr_files]
                arr.extend([i["id"] for i in arr_imgs])

                res = await self.__uow.posts.delete(id=id)
                if not res:
                    raise BadRequestException(POST_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=DELETE_POST), arr
            except GetItemByIdException as e:
                raise AnyServiceException(POST_UPD_GET_EXCEPTION) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_POST_EXCEPTION) from e

    async def like_post(self, post_id: int, id: int):
        async with self.__uow:
            try:
                like_db = await self.__uow.post_likes.get_one(
                    post_id=post_id, user_id=id
                )
                if like_db:
                    await self.__uow.post_likes.delete(post_id=post_id, user_id=id)
                    await self.__uow.commit()
                    return False
                else:
                    like = LikeInputMapper().mapping(post_id, id)
                    await self.__uow.post_likes.add(like)
                    await self.__uow.commit()
                    return True
            except ForeignKeyViolationException as e:
                raise BadRequestException(USER_POST_NOT_FOUND) from e
            except UniqueViolationException as e:
                raise BadRequestException(LIKE_EXIST) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_LIKE_EXCEPTION) from e
            except GetOneItemException as e:
                raise AnyServiceException(LIKE_EXCEPTION) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_LIKE_EXCEPTION) from e

    async def get_all(
        self,
        limit: int,
        offset: int,
        user_id: int | None,
        activity_id: int | None,
        group_id: int | None,
        type_ids: list[int] | None,
        tag_ids: list[int] | None,
        substr: str | None,
    ):
        async with self.__uow:
            try:
                ids = None
                if substr:
                    substr = clear_substr(substr)
                    ids = self.__search_post(substr)
                groups = await self.__uow.posts.get_all(
                    offset,
                    limit,
                    tag_ids,
                    ids,
                    type_ids,
                    user_id=user_id,
                    activity_id=activity_id,
                    group_id=group_id,
                )
                m = PostDBMapper()
                return process_items_from_db(groups, POSTS_NOT_FOUND, m, offset=offset)
            except GetAllItemsException as e:
                raise AnyServiceException(POSTS_EXCEPTION) from e

    def __search_post(self, substr: str):
        res = TypesenseCon.collections[NAME_SCHEMA_POST].documents.search(
            {
                "q": substr,
                "query_by": "text,tags,embedding",
                "exclude_fields": "embedding",
            }
        )
        return [
            h["document"]["post_id"]
            for h in res["hits"]
            if h["hybrid_search_info"]["rank_fusion_score"] > RANK_FUSION_SCORE
        ]
