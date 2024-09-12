from fastapi import APIRouter, Depends, Query

from src.authorization.service import AuthorizationService
from src.background_tasks.file import delete_file
from src.common.schemas import ResponseItemsSchema
from src.config import OAuth2Scheme
from src.group.consts import TYPES
from src.post.consts import *
from src.authorization.depends import *
from src.post.depends import *
from src.post.schemas import *
from src.common.consts import *
from src.post.service import *


router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get(f"/{TYPES}/{ALL}", response_model=List[PostTypeSchema])
async def get_types(
    post_service: PostService = Depends(create_post_service),
):
    return await post_service.get_all_types()


@router.post("/", response_model=FullPostSchema)
async def create_post(
    post: PostCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_owner_auth),
    post_service: PostService = Depends(create_post_service),
):
    kwargs = {"group_id": post.group_id, "activity_id": post.activity_id}
    res = await auth_service.check(METHOD_ADD, token, name=RES_POST, **kwargs)
    return await post_service.create_post(post, res.subject.id)


@router.put("/", response_model=FullPostSchema)
async def update_post(
    post: PostUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_post_owner_auth),
    post_service: PostService = Depends(create_post_service),
):
    kwargs = {"post_id": post.post_id}
    res = await auth_service.check(METHOD_UPDATE, token, name=RES_POST, **kwargs)
    res = await post_service.update_post(post)
    if post.delete_file_ids:
        for id in post.delete_file_ids:
            delete_file.delay(id, token)
    return res


@router.delete("/", response_model=MessageSchema)
async def delete_task(
    id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_post_owner_auth),
    post_service: PostService = Depends(create_post_service),
):
    kwargs = {"post_id": id}
    await auth_service.check(METHOD_DELETE, token, name=RES_POST, **kwargs)
    res, ids = await post_service.delete_post(id)

    for id in ids:
        delete_file.delay(id, token)
    return res


@router.get(f"/{ALL}", response_model=ResponseItemsSchema[FullPostSchema])
async def get_posts(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    user_id: int = Query(default=None, ge=VALUE_NOT_LESS),
    activity_id: int = Query(default=None, ge=VALUE_NOT_LESS),
    group_id: int = Query(default=None, ge=VALUE_NOT_LESS),
    type_ids: list[int] = Query(default=None),
    tag_ids: list[int] = Query(default=None),
    substr: str = Query(default=None),
    post_service: PostService = Depends(create_post_service),
):
    return await post_service.get_all(
        limit, offset, user_id, activity_id, group_id, type_ids, tag_ids, substr
    )


@router.get("/like", response_model=bool)
async def create_post(
    post_id: int = Query(ge=VALUE_NOT_LESS),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    post_service: PostService = Depends(create_post_service),
):
    res = await auth_service.check(METHOD_GET, token, name=RES_POST_LIKE)
    return await post_service.like_post(post_id, res.subject.id)
