from fastapi import WebSocket
from src.authorization.schemas import ResultCheck
from src.common.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import process_items_from_db
from src.connect.service import ConnectionService
from src.database.exceptions import *
from src.database.models.activity.activity import Activity
from src.message.const import DELETE
from src.message.mappers import MessageDBMapper, MessageInputMapper
from src.message.phrases import *
from src.message.schemas import MessageInputSchema
from src.group.const import ROLE_ID_GROUP_OBSERER


class MessageService:
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

    async def delete_message(self, data: MessageInputSchema):
        async with self.__uow:
            try:
                msg_db = await self.__uow.messages.get_by_id(data.id)
                activity = await self.__uow.activities.get_by_id(msg_db.activity_id)

                res = await self.__uow.messages.delete(id=data.id)
                if res:
                    await self.__uow.commit()
                    msg = {"id": data.id, "mode": DELETE}
                    await self.__send_group_parts(activity, msg)

            except GetItemByIdException as e:
                raise AnyServiceException(MSG_FAILED) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_MSG_EXCEPTION) from e

    async def post_message(self, data: MessageInputSchema, id: int):
        async with self.__uow:
            try:
                activity = await self.__uow.activities.get_by_id(data.activity_id)
                msg_db = MessageInputMapper().mapping(data, id)
                msg_db = await self.__uow.messages.add(msg_db)
                await self.__uow.commit()

                msg_db = await self.__uow.messages.get_by_id(msg_db.id)
                msg = MessageDBMapper().mapping(msg_db, "add")
                format = "%Y-%m-%dT%H:%M:%S.%f"
                msg.created_at = msg.created_at.strftime(format)
                msg.sender.created_at = msg.sender.created_at.strftime(format)
                msg = msg.model_dump()
                msg['activity_name']=activity.name
                await self.__send_group_parts(activity, msg)
            except GetItemByIdException as e:
                raise AnyServiceException(ACT_FAILED) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_MSG_FAILED) from e

    async def get_all(self, limit: int, offset: int, activity_id: int):
        async with self.__uow:
            try:
                groups = await self.__uow.messages.get_all(
                    offset, limit, activity_id=activity_id
                )
                return process_items_from_db(
                    groups, MSGS_NOT_FOUND, MessageDBMapper(), offset=offset
                )
            except GetAllItemsException as e:
                raise AnyServiceException(MSGS_EXCEPTION) from e

    async def __send_group_parts(self, activity: Activity, msg: dict):
        if activity.group:
            keys = [u.user_id for u in activity.group.users if u.role_id!= ROLE_ID_GROUP_OBSERER]
            await self.__connect_service.send_personal_message(msg, keys)
        else:
            await self.__connect_service.send_personal_message(
                msg, [activity.creater_id]
            )
