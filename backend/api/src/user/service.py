from fastapi import UploadFile
from passlib.context import CryptContext

from src.authorization.schemas import SubjectData
from src.common.consts import RANK_FUSION_SCORE
from src.common.schemas import MessageSchema
from src.common.utils import clear_substr, process_items_from_db
from src.config import TypesenseCon
from src.file.service import FileService
from src.user.consts import NAME_SCHEMA_USER
from src.user.phrases import *
from src.authentication.exceptions import *
from src.database.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.user.exceptions import *
from src.user.schemas import *
from src.database.models import *
from src.user.mappers import *


class UserService:
    def __init__(self, uow: IUnitOfWork, file_service: FileService):
        self.__uow = uow
        self.__file_service = file_service

    async def reset_email(self, id: int, data: ResetEmailSchema):
        async with self.__uow:
            try:
                user = await self.__uow.user_abstracts.get_by_id(id)
                if user is None:
                    raise InvalidUsernameException()
                user.email = data.new_email
                await self.__uow.users.update(user)
                await self.__uow.commit()
                return MessageSchema(message=RESET_EMAIL_SUCCESS)
            except GetItemByIdException as e:
                raise GetUserByIdException() from e
            except UpdateItemException as e:
                raise AnyServiceException(RESET_EMAIL_FAILED) from e
            except UniqueViolationException as e:
                raise GetResetEmailException(EMAIL_ALREADY_EXIST) from e

    async def delete_user(self, id: int):
        async with self.__uow:
            try:
                res = await self.__uow.user_abstracts.delete(id=id)
                if not res:
                    raise BadRequestException(INVALID_USER_ID) from None
                await self.__uow.commit()
                return MessageSchema(message=DELETE_SUCCESS)
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_EXCEPTION) from e

    async def reset_password(self, id: int, data: ResetPasswordSchema):
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        async with self.__uow:
            try:
                user = await self.__uow.user_abstracts.get_by_id(id)
                if user is None:
                    raise InvalidUsernameException()
                user.hashed_password = pwd_context.hash(data.password)
                await self.__uow.users.update(user)
                await self.__uow.commit()
                return MessageSchema(message=RESET_PASSWORD_SUCCESS)
            except GetItemByIdException as e:
                raise GetUserByIdException() from e
            except UpdateItemException as e:
                raise AnyServiceException(RESET_PASSWORD_FAILED) from e

    async def get_one(self, user_id: int):
        async with self.__uow:
            try:
                profile = await self.__uow.user_abstracts.get_one(user_id)
                if profile is None:
                    raise InvalidUserIdException() from None
                return UserAbstractDBMapper().mapping(profile)
            except GetItemByIdException as e:
                raise GetUserByIdException() from e

    async def get_all(
        self,
        limit: int,
        offset: int,
        substr: str | None,
        city_id: int | None,
        tag_ids: list[int] | None,
        min_age: int | None,
        max_age: int | None,
    ):
        async with self.__uow:
            try:
                ids = None
                if substr:
                    substr = clear_substr(substr)
                    ids = self.__search_user(substr)
                users = await self.__uow.users.get_all(
                    offset, limit, ids, tag_ids, min_age, max_age, city_id=city_id
                )
                m = UserAbstract2DBMapper()
                return process_items_from_db(users, USERS_NOT_FOUND, m, offset=offset)
            except GetAllItemsException as e:
                raise AnyServiceException(USERS_EXCEPTION) from e

    async def subscription(self, id: int, favorite_id: int):
        async with self.__uow:
            try:
                if id == favorite_id:
                    raise BadRequestException(SUBSCRIPTION_SELF) from None
                subs = SubscriptionInputMapper().mapping(id, favorite_id)
                await self.__uow.subscriptions.add(subs)
                await self.__uow.commit()
                user_db = await self.__uow.user_abstracts.get_by_id(id)
                fullname = f"{user_db.lastname} {user_db.firstname}"
                return MessageSchema(message=SUBSCRIPTION_SUCCESS), fullname
            except ForeignKeyViolationException as e:
                raise BadRequestException(INVALID_USER_ID) from e
            except UniqueViolationException as e:
                raise BadRequestException(SUBSCRIPTION_EXIST) from e
            except AddItemException as e:
                raise AnyServiceException(SUBSCRIPTION_EXCEPTION) from e

    async def unsubscription(self, id: int, favorite_id: int):
        async with self.__uow:
            try:
                if id == favorite_id:
                    raise BadRequestException(UNSUBSCRIPTION_SELF) from None
                res = await self.__uow.subscriptions.delete(
                    subscriber_id=id, favorite_id=favorite_id
                )
                if not res:
                    raise BadRequestException(SUBSCRIPTION_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=UNSUBSCRIPTION_SUCCESS)
            except DeleteItemException as e:
                raise AnyServiceException(UNSUBSCRIPTION_EXCEPTION) from e

    async def update_profile(self, subject_data: SubjectData, data: UserUpdateSchema):
        async with self.__uow:
            try:
                profile_db = await self.__uow.user_abstracts.get_one_short(
                    subject_data.id
                )
                m = ProfileInputMapper()
                profile_db = m.mapping(data, profile_db)
                await self.__uow.user_abstracts.update(profile_db)
                await self.__uow.commit()
            except GetOneItemException as e:
                raise GetUserByIdException() from e
            except UniqueViolationException as e:
                raise BadRequestException(USERNAME_NOT_UNIQUE) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(CITY_OR_REGION_NO_EXIST) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPDATE_USER_EXCEPTION) from e
            try:
                if data.delete_contacts:
                    for contact_link_id in data.delete_contacts:
                        await self.__uow.contact_users.delete(id=contact_link_id)

                if data.add_contacts:
                    contact_m = ContactUserInputMapper()
                    for contact_link in data.add_contacts:
                        contact_db = contact_m.mapping(contact_link, subject_data.id)
                        await self.__uow.contact_users.add(contact_db)

                await self.__uow.commit()
                return MessageSchema(message=UPDATE_USER_SUCCESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(TYPE_CONTACT_NO_EXIST) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_CONTACT_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_CONTACT_EXCEPTION) from e

    async def post_avatar(self, file: UploadFile, id: int, token: str):
        async with self.__uow:
            try:
                profile_db = await self.__uow.user_abstracts.get_by_id(id)
                ava_id = AvatarDBMapper().mapping(profile_db.avatar).id
                res = await self.__file_service.post_file(file, token)
                profile_db.avatar = AvatarInputMapper().mapping(res)
                await self.__uow.user_abstracts.update(profile_db)
                await self.__uow.commit()
                return AvatarSchema(**profile_db.avatar), ava_id
            except GetItemByIdException as e:
                raise GetUserByIdException() from e

    async def post_cover(self, file: UploadFile, id: int, token: str):
        async with self.__uow:
            try:
                profile_db = await self.__uow.user_abstracts.get_by_id(id)
                decoration_id = DecorationDBMapper().mapping(profile_db.decoration).id
                res = await self.__file_service.post_file(file, token)
                profile_db.decoration = DecorationInputMapper().mapping(res)
                await self.__uow.user_abstracts.update(profile_db)
                await self.__uow.commit()
                return DecorationSchema(**profile_db.decoration), decoration_id
            except GetItemByIdException as e:
                raise GetUserByIdException() from e

    def __search_user(self, substr: str):
        res = TypesenseCon.collections[NAME_SCHEMA_USER].documents.search(
            {
                "q": substr,
                "query_by": "firstname,lastname,email,username,city,tags",
            }
        )
        return [h["document"]["user_id"] for h in res["hits"]]
       