from fastapi import APIRouter, Body, Depends, Query, UploadFile, File

from src.common.consts import *
from src.authorization.service import AuthorizationService
from src.config import OAuth2Scheme
from src.common.schemas import MessageSchema, ResponseItemsSchema
from src.user.consts import *
from src.authorization.depends import factory_default_auth
from src.user.depends import factory_res_profile_user_auth
from src.user.depends import create_user_service
from src.user.phrases import SUB
from src.user.schemas.sub import SubSchema
from src.user.service import UserService
from src.user.schemas import *
from src.background_tasks.base import *


router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.put(f"/{METHOD_RESET}_{RESOURCE_EMAIL}", response_model=MessageSchema)
async def reset_email(
    data: ResetEmailSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_UPDATE, token, name=RESOURCE_EMAIL)
    return await user_service.reset_email(res.subject.id, data)


@router.delete("/")
async def delete_user(
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_DELETE, token, name=RESOURCE_PROFILE)
    return await user_service.delete_user(res.subject.id)


@router.put(f"/{METHOD_RESET}_{RESOURCE_PASSWORD}", response_model=MessageSchema)
async def reset_password(
    data: ResetPasswordSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_UPDATE, token, name=RESOURCE_PASSWORD)
    return await user_service.reset_password(res.subject.id, data)


@router.get(f"/{RESOURCE_PROFILE}/{ONE}", response_model=UserAbstractSchema)
async def get_profile_one(
    id: int = Query(default=None, gt=0),
    username: str = Query(default=None),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_profile_user_auth),
    user_service: UserService = Depends(create_user_service),
):
    kwargs = {"id": id, "name": RESOURCE_PROFILE, "username": username}
    res = await auth_service.check(METHOD_GET_ONE, token, **kwargs)
    user_id = res.resource.owner_id if res.resource.owner_id else res.subject.id
    return await user_service.get_one(user_id)


@router.get(
    f"/{RESOURCE_PROFILE}/{ALL}",
    response_model=ResponseItemsSchema[ShortUserWithUserAbstractSchema],
)
async def get_all_users(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    substr: str = Query(default=None),
    city_id: int = Query(default=None),
    tag_ids: list[int] = Query(default=None),
    min_age: int = Query(default=None),
    max_age: int = Query(default=None),
    user_service: UserService = Depends(create_user_service),
):
    return await user_service.get_all(
        limit, offset, substr, city_id, tag_ids, min_age, max_age
    )


@router.put(f"/{RESOURCE_PROFILE}", response_model=MessageSchema)
async def update_profile(
    data: UserUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_UPDATE, token, name=RESOURCE_PROFILE)
    return await user_service.update_profile(res.subject, data)


@router.post(f"/{RESOURCE_SUBSCRIPTION}", response_model=MessageSchema)
async def subscription(
    favorite: SubSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_SUBSCRIPTION)
    r, name = await user_service.subscription(res.subject.id, favorite.favorite_id)
    send_note.delay(SUB.format(name), favorite.favorite_id)
    return r


@router.delete(f"/{RESOURCE_SUBSCRIPTION}", response_model=MessageSchema)
async def unsubscription(
    favorite_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_DELETE, token, name=RESOURCE_SUBSCRIPTION)
    return await user_service.unsubscription(res.subject.id, favorite_id)


@router.post(f"/{RESOURCE_AVA}", response_model=AvatarSchema)
async def post_avatar(
    file: UploadFile = File(...),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_AVA)
    avatar, old_ava_id = await user_service.post_avatar(file, res.subject.id, token)
    if old_ava_id:
        delete_file.delay(old_ava_id, token)
    return avatar


@router.post(f"/{RESOURCE_COVER}", response_model=DecorationSchema)
async def post_cover(
    file: UploadFile = File(...),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    user_service: UserService = Depends(create_user_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_COVER)
    cover, old_cover_id = await user_service.post_cover(file, res.subject.id, token)
    if old_cover_id:
        delete_file.delay(old_cover_id, token)
    return cover
