from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPAuthorizationCredentials

from src.authorization.service import AuthorizationService
from src.common.const import *
from src.common.exceptions import ServiceException
from src.common.schemas import ResponseItemsSchema
from src.config import OAuth2Scheme
from src.message.const import *
from src.message.depends import *
from src.message.mappers import JSONInputMapper
from src.message.phrases import CONNECTED_SUCCESS
from src.message.schemas import FullMessageSchema
from src.token.schemas import TokenDataSchema


router = APIRouter(tags=[NAME_SERVICE])


@router.get("/all", response_model=ResponseItemsSchema[FullMessageSchema])
async def get_messages(
    token: HTTPAuthorizationCredentials = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_task_activity_get_auth),
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    activity_id: int = Query(default=None, ge=VALUE_NOT_LESS),
    message_service: MessageService = Depends(get_message_service),
):
    kwargs = {"activity_id": activity_id}
    await auth_service.check(METHOD_GET, token.credentials, name=RESOURCE_MSG, **kwargs)
    return await message_service.get_all(limit, offset, activity_id)


@router.websocket("/messages")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(),
    auth_service: AuthorizationService = Depends(factory_res_task_activity_get_auth),
    message_service: MessageService = Depends(get_message_service),
):
    res = None
    try:
        await websocket.accept()
        res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_CON)
        await message_service.connect(websocket, res.subject.id)
        await websocket.send_json({"msg": CONNECTED_SUCCESS, "code": 200})

        while True:
            data = await websocket.receive_json()
            data = JSONInputMapper().mapping(data)
            td = TokenDataSchema.Of(res.subject.id, res.subject.role_id)
            g_t = auth_service.gen_token(td)
            if data.action == ADD:
                kwargs = {"activity_id": data.activity_id}
                res = await auth_service.check(
                    METHOD_ADD, g_t.access_token, name=RESOURCE_MSG, **kwargs
                )
                await message_service.post_message(data, res.subject.id)
            elif data.action == DELETE:
                kwargs = {"message_id": data.id}
                res = await auth_service.check(
                    METHOD_DELETE, g_t.access_token, name=RESOURCE_MSG, **kwargs
                )
                await message_service.delete_message(data)
    except ServiceException as e:
        await message_service.send_except(e, websocket, res)
    except WebSocketDisconnect:
        await message_service.disconnect(res.subject.id)
    except Exception as e:
        await message_service.send_except(e, websocket, res)
