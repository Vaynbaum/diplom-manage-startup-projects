from typing import List
from fastapi import APIRouter, Depends, File, Query, UploadFile
from src.background_tasks.file import delete_file

from src.background_tasks.note import send_note
from src.common.schemas import *
from src.group.service import *
from src.group.schemas import *
from src.common.consts import *
from src.authorization.service import AuthorizationService
from src.config import OAuth2Scheme
from src.group.consts import *
from src.authorization.depends import *
from src.group.depends import *


router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get(f"/{TYPES}/{ALL}", response_model=List[GroupTypeSchema])
async def get_types(
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_all_types()


@router.post("/", response_model=GroupSchema)
async def create_group(
    group: GroupCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RES_GROUP)
    return await group_service.create_group(group, res.subject)


@router.put("/", response_model=MessageSchema)
async def update_group(
    data: GroupUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": data.group_id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_GROUP, **kwargs)
    return await group_service.update_group(data)


@router.delete("/", response_model=MessageSchema)
async def delete_group(
    group_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": group_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_GROUP, **kwargs)
    m, ava_id, decoration_id = await group_service.delete_group(group_id)
    if ava_id:
        delete_file.delay(ava_id, token)
    if decoration_id:
        delete_file.delay(decoration_id, token)
    return m


@router.get(f"/{ALL}", response_model=ResponseItemsSchema[GroupWithUserSchema])
async def get_groups(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    substr: str = Query(default=None),
    type_ids: list[int] = Query(default=None),
    tag_ids: list[int] = Query(default=None),
    is_vac: bool = Query(default=False),
    is_act: bool = Query(default=False),
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_all(
        limit, offset, substr, type_ids, tag_ids, is_vac, is_act
    )


@router.get(f"/{ALL}/my", response_model=List[GroupDBSchema])
async def get_my_groups(
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    res = await auth_service.check(METHOD_GET_ALL, token, name=RES_GROUP)
    return await group_service.get_my_groups(res.subject.id)


@router.get(f"/{ONE}", response_model=FullGroupSchema)
async def get_group_one(
    id: int = Query(default=None, gt=0),
    username: str = Query(default=None),
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_one(id, username)


@router.post(f"/subscription", response_model=MessageSchema)
async def sub_group(
    data: SubSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": data.group_id}
    res = await auth_service.check(METHOD_ADD, token, name=RES_GROUP_SUB, **kwargs)
    return await group_service.sub_group(data.group_id, res.subject.id)


@router.delete(f"/unsubscription", response_model=MessageSchema)
async def sub_group(
    group_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": group_id}
    res = await auth_service.check(METHOD_DELETE, token, name=RES_GROUP_SUB, **kwargs)
    return await group_service.unsub_group(group_id, res.subject.id)


@router.get(f"/roles", response_model=List[GroupRoleSchema])
async def get_roles(
    is_common: bool = Query(default=True),
    group_id: int = Query(gt=0),
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_roles(group_id, is_common)


@router.post(f"/roles", response_model=MessageSchema)
async def create_role(
    role: GroupRoleCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": role.group_id}
    await auth_service.check(METHOD_ADD, token, name=RES_GROUP_ROLE, **kwargs)
    return await group_service.create_role(role)


@router.put(f"/roles", response_model=MessageSchema)
async def update_role(
    role: GroupRoleUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_role_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"role_id": role.id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_GROUP_ROLE, **kwargs)
    return await group_service.update_role(role)


@router.delete(f"/roles", response_model=MessageSchema)
async def delete_role(
    id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_role_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"role_id": id}
    await auth_service.check(METHOD_DELETE, token, name=RES_GROUP_ROLE, **kwargs)
    return await group_service.delete_role(id)


@router.post(f"/roles/assign", response_model=MessageSchema)
async def assign_role(
    data: GroupRoleAssignSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_role_group_assign_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = data.dict()
    await auth_service.check(METHOD_ADD, token, name=RES_GROUP_ROLE_ASSIGN, **kwargs)
    res, r_n, g_n = await group_service.assign_role(data)
    send_note.delay(ROLE_ASS.format(r_n, g_n), data.user_id)
    return res


@router.delete(f"/user", response_model=MessageSchema)
async def kick_user(
    group_id: int = Query(gt=0),
    user_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_user_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": group_id, "user_id": user_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_GROUP_USER, **kwargs)
    return await group_service.kick_user(group_id, user_id)


@router.post("/avatar", response_model=AvatarSchema)
async def post_avatar(
    file: UploadFile = File(...),
    token: str = Depends(OAuth2Scheme),
    group_id: int = Query(gt=0),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": group_id}
    await auth_service.check(METHOD_ADD, token, name=RES_GROUP_AVA, **kwargs)
    avatar, old_ava_id = await group_service.post_avatar(file, group_id, token)
    if old_ava_id:
        delete_file.delay(old_ava_id, token)
    return avatar


@router.post("/cover", response_model=DecorationSchema)
async def post_cover(
    file: UploadFile = File(...),
    group_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": group_id}
    await auth_service.check(METHOD_ADD, token, name=RES_GROUP_COVER, **kwargs)
    cover, old_cover_id = await group_service.post_cover(file, group_id, token)
    if old_cover_id:
        delete_file.delay(old_cover_id, token)
    return cover


@router.post("/vacancy", response_model=MessageSchema)
async def post_vacancy(
    vacancy: VacancyCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"group_id": vacancy.group_id}
    await auth_service.check(METHOD_ADD, token, name=RES_VACANCY, **kwargs)
    return await group_service.post_vacancy(vacancy)


@router.put("/vacancy", response_model=MessageSchema)
async def put_vacancy(
    vacancy: VacancyUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"vacancy_id": vacancy.vacancy_id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_VACANCY, **kwargs)
    return await group_service.put_vacancy(vacancy)


@router.delete("/vacancy", response_model=MessageSchema)
async def delete_vacancy(
    vacancy_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"vacancy_id": vacancy_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_VACANCY, **kwargs)
    return await group_service.delete_vacancy(vacancy_id)


@router.get("/vacancy/one", response_model=VacancySchema)
async def get_vacancy_one(
    vacancy_id: int = Query(gt=0),
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_vacancy_one(vacancy_id)


@router.post("/vacancy/response", response_model=MessageSchema)
async def post_vacancy_response(
    data: CreateVacancyResponse,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    r = await auth_service.check(METHOD_ADD, token, name=RES_VAC_RES)
    res, vac_name, user_id = await group_service.post_vacancy_response(
        data.vacancy_id, r.subject.id
    )
    send_note.delay(VAC_REQ.format(vac_name), user_id)
    return res


@router.delete("/vacancy/response", response_model=MessageSchema)
async def delete_vacancy_response(
    vacancy_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    r = await auth_service.check(METHOD_DELETE, token, name=RES_VAC_RES)
    return await group_service.delete_vacancy_response(vacancy_id, r.subject.id)


@router.post("/vacancy/response/approve", response_model=MessageSchema)
async def post_vacancy_response_approve(
    data: CreateVacancyResponseApprove,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"vacancy_id": data.vacancy_id}
    await auth_service.check(METHOD_ADD, token, name=RES_VAC_RES_APP, **kwargs)
    res, name = await group_service.post_vacancy_response_approve(data)
    send_note.delay(APPROVE.format(name), data.user_id)
    return res


@router.post("/vacancy/response/reject", response_model=MessageSchema)
async def post_vacancy_response_reject(
    data: CreateVacancyResponseApprove,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_vacancy_auth),
    group_service: GroupService = Depends(create_group_service),
):
    kwargs = {"vacancy_id": data.vacancy_id}
    await auth_service.check(METHOD_ADD, token, name=RES_VAC_RES_REJ, **kwargs)
    res, name = await group_service.post_vacancy_response_reject(data)
    send_note.delay(REJECT.format(name), data.user_id)
    return res


@router.get(
    "/vacancy/responses", response_model=ResponseItemsSchema[VacancyUser2Schema]
)
async def get_vacancy_responses(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    vacancy_id: int = Query(gt=0),
    group_service: GroupService = Depends(create_group_service),
):
    return await group_service.get_vacancy_responses(vacancy_id, limit, offset)


@router.post("/invites", response_model=MessageSchema)
async def post_invite(
    data: CreateGroupInviteShema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    r = await auth_service.check(METHOD_ADD, token, name=RES_GROUP_INS)
    res, name, u = await group_service.post_invite(data, r.subject.id)
    send_note.delay(INVITE_SENDED.format(u, name), data.user_id)
    return res


@router.put("/invites", response_model=MessageSchema)
async def put_invite(
    data: ResponseInviteGroupInviteShema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    r = await auth_service.check(METHOD_UPDATE, token, name=RES_GROUP_INS)
    res, id, u, name = await group_service.put_invite(data, r.subject.id)
    m = INVITE_AP.format(u, name) if data.is_approved else INVITE_RE.format(u, name)
    send_note.delay(m, id)
    return res


@router.delete("/invites", response_model=MessageSchema)
async def delete_invite(
    group_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    group_service: GroupService = Depends(create_group_service),
):
    r = await auth_service.check(METHOD_DELETE, token, name=RES_GROUP_INS)
    return await group_service.delete_invite(group_id, r.subject.id)
