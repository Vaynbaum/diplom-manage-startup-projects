from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPAuthorizationCredentials

from src.authorization.service import AuthorizationService
from src.common.const import *
from src.common.exceptions import ServiceException
from src.common.schemas import ResponseItemsSchema
from src.config import OAuth2Scheme
from src.note.const import *
from src.note.depends import *
from src.note.mappers import JSONInputMapper
from src.note.phrases import CONNECTED_SUCCESS
from src.note.schemas import *
from src.note.service import NoteService
from src.authorization.depends import factory_default_auth


router = APIRouter(tags=[NAME_SERVICE])


@router.get("/all", response_model=ResponseItemsSchema[NotificationSchema])
async def get_notifications(
    token: HTTPAuthorizationCredentials = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    note_service: NoteService = Depends(get_message_service),
):
    res = await auth_service.check(METHOD_GET, token.credentials, name=RESOURCE_NOTE)
    return await note_service.get_all(limit, offset, res.subject.id)


@router.post("/")
async def post_notification(
    data: NoteInputSchema,
    note_service: NoteService = Depends(get_message_service),
):
    return await note_service.post_notification(data)


@router.websocket("/notifications")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(),
    auth_service: AuthorizationService = Depends(factory_default_auth),
    note_service: NoteService = Depends(get_message_service),
):
    res = None
    try:
        await websocket.accept()
        res = await auth_service.check(METHOD_GET, token, name=RESOURCE_NOTE)
        await note_service.connect(websocket, res.subject.id)
        await websocket.send_json({"msg": CONNECTED_SUCCESS, "code": 200})

        while True:
            data = await websocket.receive_json()
            data = JSONInputMapper().mapping(data)
            await note_service.read_notes(data.ids, res.subject.id)
    except ServiceException as e:
        await note_service.send_except(e, websocket, res)
    except WebSocketDisconnect:
        await note_service.disconnect(res.subject.id)
    except Exception as e:
        await note_service.send_except(e, websocket, res)
