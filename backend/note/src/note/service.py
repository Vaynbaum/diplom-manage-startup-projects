from fastapi import WebSocket
from src.authorization.schemas import ResultCheck
from src.common.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import process_items_from_db
from src.connect.service import ConnectionService
from src.database.exceptions import *
from src.note.mappers import *
from src.note.phrases import *


class NoteService:
    def __init__(self, uow: IUnitOfWork, connect_service: ConnectionService):
        self.__uow = uow
        self.__connect_service = connect_service

    async def connect(self, websocket: WebSocket, key: int):
        await self.__connect_service.connect(websocket, key)

    async def send_except(
        self, err: ServiceException, websocket: WebSocket, res: ResultCheck | None
    ):
        await self.__connect_service.send_except(err, websocket, res)

    async def disconnect(self, key: int):
        await self.__connect_service.disconnect(key)

    async def read_notes(self, ids: list[int], user_id: int):
        async with self.__uow:
            try:
                for id in ids:
                    note_db = await self.__uow.notifications.get_one(
                        id=id, user_abstract_id=user_id
                    )
                    if note_db and not note_db.is_readed:
                        note_db.is_readed = True
                        await self.__uow.notifications.update(note_db)
                await self.__uow.commit()
                await self.__connect_service.send_personal_message(
                    {"readed": True, "ids": ids}, [user_id]
                )
            except GetOneItemException as e:
                raise AnyServiceException(READ_NOTE_FAILED) from e
            except UpdateItemException as e:
                raise AnyServiceException(READ_NOTE_FAILED) from e

    async def post_notification(self, data: NoteInputSchema):
        async with self.__uow:
            try:
                note_db = NotificationInputMapper().mapping(data)
                note_db = await self.__uow.notifications.add(note_db)
                await self.__uow.commit()

                note_db = await self.__uow.notifications.get_by_id(note_db.id)
                msg = NotificationDBMapper().mapping(note_db)
                format = "%Y-%m-%dT%H:%M:%S.%f"
                msg.created_at = msg.created_at.strftime(format)
                msg = msg.model_dump()
                await self.__connect_service.send_personal_message(msg, [data.user_id])
            except AddItemException as e:
                raise AnyServiceException(ADD_MSG_FAILED) from e

    async def get_all(self, limit: int, offset: int, id: int):
        async with self.__uow:
            try:
                groups = await self.__uow.notifications.get_all(
                    offset, limit, user_abstract_id=id
                )
                return process_items_from_db(
                    groups, MSGS_NOT_FOUND, NotificationDBMapper(), offset=offset
                )
            except GetAllItemsException as e:
                raise AnyServiceException(MSGS_EXCEPTION) from e
