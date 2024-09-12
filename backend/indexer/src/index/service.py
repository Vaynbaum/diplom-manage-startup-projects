from src.common.consts import *
from src.common.exceptions import AnyServiceException
from src.common.mappers import BaseMapper
from src.common.schemas import MessageSchema
from src.common.services.unit_of_work import IUnitOfWork
from src.config import TypesenseCon
from src.database.exceptions import GetAllItemsException
from src.index.mappers import *
from src.phrases import *


class IndexService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def update_state(self):
        msgs = []
        async with self.__uow:
            try:
                m = ActivityDBMapper()
                q = "tag_id:>0"
                s = NAME_SCHEMA_ACTIVITY
                await self._core_update_state(m, self.__uow.activities, s, q)
                msgs.append(MessageSchema(message=ACTIVITIES_SUCCESS))
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e

            try:
                m = GroupDBMapper()
                q = "group_id:>0"
                s = NAME_SCHEMA_GROUP
                await self._core_update_state(m, self.__uow.groups, s, q)
                msgs.append(MessageSchema(message=GROUPS_SUCCESS))
            except GetAllItemsException as e:
                raise AnyServiceException(GROUPS_EXCEPTION) from e

            try:
                m = PostDBMapper()
                q = "post_id:>0"
                s = NAME_SCHEMA_POST
                await self._core_update_state(m, self.__uow.posts, s, q)
                msgs.append(MessageSchema(message=GROUPS_SUCCESS))
            except GetAllItemsException as e:
                raise AnyServiceException(POSTS_EXCEPTION) from e

            try:
                m = UserDBMapper()
                q = "user_id:>0"
                s = NAME_SCHEMA_USER
                await self._core_update_state(m, self.__uow.users, s, q)
                msgs.append(MessageSchema(message=USERS_SUCCESS))
                return msgs
            except GetAllItemsException as e:
                raise AnyServiceException(USERS_EXCEPTION) from e

    async def _core_update_state(self, m: BaseMapper, rep, schema: str, query: str):
        offset = 0
        try:
            TypesenseCon.collections[schema].documents.delete({"filter_by": query})
        except:
            pass
        while True:
            objects = await rep.get_all(offset, DEFAULT_LIMIT)
            offset += 1
            if len(objects) > 0:
                new_objects = [m.mapping(obj) for obj in objects]
                TypesenseCon.collections[schema].documents.import_(new_objects)
            else:
                break
