from typing import List
from fastapi import APIRouter, Body, Depends, Query

from src.common.schemas import *
from src.authorization.service import AuthorizationService
from src.config import OAuth2Scheme
from src.common.consts import *
from src.authorization.depends import factory_default_auth
from src.group.depends import factory_res_vacancy_auth
from src.tag.depends import *
from src.tag.consts import *
from src.tag.depends import create_tag_service
from src.tag.service import TagService
from src.tag.schemas import *


router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get(f"/{ALL}", response_model=List[TagSchema])
async def get_all_tags(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    ids: list[int] = Query(default=None),
    to_user: bool = Query(default=False),
    to_group: bool = Query(default=False),
    to_activity: bool = Query(default=False),
    to_post: bool = Query(default=False),
    substr: str = Query(default=None),
    tag_service: TagService = Depends(create_tag_service),
):
    return await tag_service.get_all(
        limit, offset, substr, ids, to_user, to_group, to_activity,to_post
    )


@router.get(f"/{LEVELS}/{ALL}", response_model=List[TagLevelSchema])
async def get_all_levels(
    tag_service: TagService = Depends(create_tag_service),
):
    return await tag_service.get_all_levels()


@router.post(f"/{USER}", response_model=MessageSchema)
async def post_user_tag_links(
    tags: List[TagCreateIdSchema] = Body(default=None),
    tag_names: List[TagCreateNameSchema] = Body(default=None),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_USER_TAG)
    return await tag_service.post_user_tag_links(res.subject.id, tags, tag_names)


@router.delete(f"/{USER}", response_model=MessageSchema)
async def delete_user_tag_links(
    tag_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    res = await auth_service.check(METHOD_DELETE, token, name=RESOURCE_USER_TAG)
    return await tag_service.delete_user_tag_links(res.subject.id, tag_id)


@router.post("/activity", response_model=MessageSchema)
async def post_activity_tag_links(
    activity_id: int = Query(gt=0),
    tags: List[SimpleTagCreateId] = Body(default=None),
    tag_names: List[SimpleTagCreateName] = Body(default=None),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_ADD, token, name=RES_ACT_TAG, **kwargs)
    return await tag_service.post_activity_tag_links(activity_id, tags, tag_names)


@router.delete("/activity", response_model=MessageSchema)
async def delete_activity_tag_links(
    activity_id: int = Query(gt=0),
    tag_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_ACT_TAG, **kwargs)
    return await tag_service.delete_activity_tag_links(activity_id, tag_id)


@router.post("/vacancy", response_model=MessageSchema)
async def post_vacancy_tag_links(
    vacancy_id: int = Query(gt=0),
    tags: List[TagCreateIdSchema] = Body(default=None),
    tag_names: List[TagCreateNameSchema] = Body(default=None),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    kwargs = {"vacancy_id": vacancy_id}
    await auth_service.check(METHOD_ADD, token, name=RES_VAC_TAG, **kwargs)
    return await tag_service.post_vacancy_tag_links(vacancy_id, tags, tag_names)


@router.delete("/vacancy", response_model=MessageSchema)
async def delete_vacancy_tag_links(
    vacancy_id: int = Query(gt=0),
    tag_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    tag_service: TagService = Depends(create_tag_service),
):
    kwargs = {"vacancy_id": vacancy_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_VAC_TAG, **kwargs)
    return await tag_service.delete_vacancy_tag_links(vacancy_id, tag_id)
