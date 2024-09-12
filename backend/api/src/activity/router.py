from typing import List
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from src.background_tasks.file import delete_file

from src.background_tasks.note import send_note
from src.common.schemas import *
from src.activity.service import *
from src.activity.schemas import *
from src.common.consts import *
from src.tag.depends import *
from src.authorization.service import AuthorizationService
from src.group.depends import *
from src.config import OAuth2Scheme
from src.activity.consts import *
from src.authorization.depends import *
from src.activity.depends import *

router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get("/status/all", response_model=List[ActivityStatusSchema])
async def get_types(
    activity_service: ActivityService = Depends(create_activity_service),
):
    return await activity_service.get_all_status()


@router.get("/direction/all", response_model=List[DirectionSchema])
async def get_directions(
    activity_service: ActivityService = Depends(create_activity_service),
):
    return await activity_service.get_all_directions()


@router.post("/", response_model=ActivityDBSchema)
async def create_activity(
    activity: ActivityCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    res = await auth_service.check(METHOD_ADD, token, name=RES_ACTIVITY)
    return await activity_service.create_activity(activity, res.subject)


@router.get(f"/{ALL}", response_model=ResponseItemsSchema[ActivitySchema])
async def get_activites(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    substr: str = Query(default=None),
    status_ids: list[int] = Query(default=None),
    direction_ids: list[int] = Query(default=None),
    tag_ids: list[int] = Query(default=None),
    is_group: bool = Query(default=False),
    activity_service: ActivityService = Depends(create_activity_service),
):
    return await activity_service.get_all(
        limit, offset, substr, status_ids, direction_ids, tag_ids, is_group
    )


@router.get(f"/{ALL}/my", response_model=List[ActivityDBSchema])
async def get_my_activities(
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    res = await auth_service.check(METHOD_GET_ALL, token, name=RES_ACTIVITY)
    return await activity_service.get_my_activities(res.subject.id)


@router.post("/avatar", response_model=AvatarSchema)
async def post_avatar(
    file: UploadFile = File(...),
    token: str = Depends(OAuth2Scheme),
    activity_id: int = Query(gt=0),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_ADD, token, name=RES_ACTIVITY_AVA, **kwargs)
    avatar, old_ava_id = await activity_service.post_avatar(file, activity_id, token)
    if old_ava_id:
        delete_file.delay(old_ava_id, token)
    return avatar


@router.post("/cover", response_model=DecorationSchema)
async def post_cover(
    file: UploadFile = File(...),
    activity_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_ADD, token, name=RES_ACTIVITY_COVER, **kwargs)
    cover, old_cover_id = await activity_service.post_cover(file, activity_id, token)
    if old_cover_id:
        delete_file.delay(old_cover_id, token)
    return cover


@router.get(f"/{ONE}", response_model=FullActivitySchema)
async def get_activity_one(
    id: int = Query(gt=0),
    activity_service: ActivityService = Depends(create_activity_service),
):
    return await activity_service.get_one(id)


@router.put("/", response_model=MessageSchema)
async def update_activity(
    data: ActivityUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": data.activity_id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_ACTIVITY, **kwargs)
    return await activity_service.update_activity(data)


@router.delete("/", response_model=MessageSchema)
async def delete_activity(
    activity_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_ACTIVITY, **kwargs)
    m, ava_id, decoration_id = await activity_service.delete_activity(activity_id)
    if ava_id:
        delete_file.delay(ava_id, token)
    if decoration_id:
        delete_file.delay(decoration_id, token)
    return m


@router.post("/invitation", response_model=MessageSchema)
async def create_invitation(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": data.activity_id}
    await auth_service.check(METHOD_ADD, token, name=RES_INVATION, **kwargs)
    res, g_n, id, a_n = await activity_service.create_invitation(data)
    send_note.delay(INV.format(g_n, a_n), id)
    return res


@router.delete("/invitation", response_model=MessageSchema)
async def delete_invitation(
    group_id: int = Query(gt=0),
    activity_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_INVATION, **kwargs)
    return await activity_service.delete_invitation(group_id, activity_id, False)


@router.put("/invitation/approve", response_model=MessageSchema)
async def approve_invitation(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_link_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(
        METHOD_UPDATE, token, name=RES_INVATIONT, **data.model_dump()
    )
    res, a_n, _, a_id = await activity_service.approve_invitation(data, False)
    send_note.delay(INV_APP.format(a_n), a_id)
    return res


@router.put("/invitation/reject", response_model=MessageSchema)
async def reject_invitation(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_link_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(
        METHOD_UPDATE, token, name=RES_INVATION_, **data.model_dump()
    )
    res, a_n, _, a_id = await activity_service.reject_invitation(data, False)
    send_note.delay(INV_REJ.format(a_n), a_id)
    return res


@router.post("/request", response_model=MessageSchema)
async def create_request(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"group_id": data.group_id}
    await auth_service.check(METHOD_ADD, token, name=RES_REQUEST, **kwargs)
    res, g_n, id, a_n = await activity_service.create_request(data)
    send_note.delay(REQ.format(g_n, a_n), id)
    return res


@router.delete("/request", response_model=MessageSchema)
async def delete_request(
    group_id: int = Query(gt=0),
    activity_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"group_id": group_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_REQUEST, **kwargs)
    return await activity_service.delete_invitation(group_id, activity_id, True)


@router.put("/request/approve", response_model=MessageSchema)
async def approve_request(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_link_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(
        METHOD_UPDATE, token, name=RES_REQUESTT, **data.model_dump()
    )
    res, a_n, g_id, _ = await activity_service.approve_invitation(data, True)
    send_note.delay(REQ_APP.format(a_n), g_id)
    return res


@router.put("/request/reject", response_model=MessageSchema)
async def reject_request(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_link_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(
        METHOD_UPDATE, token, name=RES_REQUEST_, **data.model_dump()
    )
    res, a_n, g_id, _ = await activity_service.reject_invitation(data, True)
    send_note.delay(REQ_REJ.format(a_n), g_id)
    return res


@router.put("/exit", response_model=MessageSchema)
async def exit_to_activity(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_group_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(METHOD_UPDATE, token, name=RES_EXIT, **data.model_dump())
    res, a_n, a_id, g_n, _ = await activity_service.exit_to_activity(data, False)
    send_note.delay(GROUP_EXIT.format(g_n, a_n), a_id)
    return res


@router.put("/kick/group", response_model=MessageSchema)
async def kick_group_from_activity(
    data: ActivityGroupSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    await auth_service.check(METHOD_UPDATE, token, name=RES_KICK, **data.model_dump())
    res, a_n, _, g_n, g_id = await activity_service.exit_to_activity(data, True)
    send_note.delay(GROUP_KICK.format(g_n, a_n), g_id)
    return res


@router.post("/task", response_model=MessageSchema)
async def create_task(
    data: CreateTaskSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_activity_group_link_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": data.activity_id}
    res = await auth_service.check(METHOD_ADD, token, name=RES_TASK, **kwargs)
    return await activity_service.create_task(data, res.subject.id)


@router.put("/task", response_model=MessageSchema)
async def update_task(
    data: UpdateTaskSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(
        factory_res_task_activity_group_link_auth
    ),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"task_id": data.task_id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_TASK, **kwargs)
    res = await activity_service.update_task(data)

    for id in data.delete_ids:
        delete_file.delay(id, token)
    return res


@router.delete("/task", response_model=MessageSchema)
async def delete_task(
    id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(
        factory_res_task_activity_group_link_auth
    ),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"task_id": id}
    await auth_service.check(METHOD_DELETE, token, name=RES_TASK, **kwargs)
    res, ids = await activity_service.delete_task(id)

    for id in ids:
        delete_file.delay(id, token)
    return res


@router.post("/task/assign", response_model=MessageSchema)
async def assign_task(
    data: AssignTaskSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(
        factory_res_task_user_activity_group_link_auth
    ),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {**data.model_dump()}
    await auth_service.check(METHOD_ADD, token, name=RES_TASK_ASSIGN, **kwargs)
    res, t_n, a_n = await activity_service.assign_task(data)
    send_note.delay(TASK_ASS.format(t_n, a_n), data.user_id)
    return res


@router.delete("/task/assign", response_model=MessageSchema)
async def delete_assign_task(
    task_id: int = Query(gt=0),
    user_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(
        factory_res_task_user_activity_group_link_auth
    ),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"task_id": task_id, "user_id": user_id}
    await auth_service.check(METHOD_DELETE, token, name=RES_TASK_ASSIGN, **kwargs)
    return await activity_service.delete_assign_task(task_id, user_id)


@router.put("/task/status", response_model=MessageSchema)
async def change_task_status(
    data: ChangeTaskStatus,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(
        factory_res_task_user_activity_group_link_status_auth
    ),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"task_id": data.task_id}
    await auth_service.check(METHOD_UPDATE, token, name=RES_TASK_STATUS, **kwargs)
    return await activity_service.change_task_status(data)


@router.get("/task/status/all", response_model=List[ActivityTaskStatusShema])
async def get_types(
    activity_service: ActivityService = Depends(create_activity_service),
):
    return await activity_service.get_all_task_status()


@router.get("/task/all", response_model=List[ActivityTaskUsersShema])
async def get_tasks(
    activity_id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_task_activity_get_auth),
    activity_service: ActivityService = Depends(create_activity_service),
):
    kwargs = {"activity_id": activity_id}
    res = await auth_service.check(METHOD_GET_ALL, token, name=RES_TASK, **kwargs)
    return await activity_service.get_tasks(activity_id, res)
