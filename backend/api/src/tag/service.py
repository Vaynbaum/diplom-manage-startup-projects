from src.database.exceptions import *
from src.common.schemas import *
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import *
from src.database.repositories.generic import GenericRepository
from src.tag.phrases import *
from src.tag.schemas import *
from src.tag.mappers import *


class TagService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all(
        self,
        l: int,
        o: int,
        substr: str | None,
        ids: list[int] | None,
        to_user: bool,
        to_group: bool,
        to_activity: bool,
        to_post: bool,
    ) -> List[TagSchema]:
        async with self.__uow:
            try:
                if substr:
                    substr = " ".join(substr.split())
                    substr = substr.strip()
                tags = await self.__uow.tags.get_all(
                    l, o, substr, ids, to_user, to_group, to_activity, to_post
                )
                return process_items_from_db(tags, TAGS_404, TagDBMapper(), False)
            except GetAllItemsException as e:
                raise AnyServiceException(TAGS_EXCEPTION) from e

    async def get_all_levels(self):
        async with self.__uow:
            try:
                levels = await self.__uow.tag_levels.get_all()
                return process_items_from_db(levels, LEVELS_404, LevelDBMapper(), False)
            except GetAllItemsException as e:
                raise AnyServiceException(TAGS_EXCEPTION) from e

    async def post_vacancy_tag_links(
        self,
        id: int,
        tags: list[TagCreateIdSchema] | None,
        tag_names: list[TagCreateNameSchema] | None,
    ):
        async with self.__uow:
            try:
                m = VacancyTagLinkInputMapper()
                tm = TagInputMapper()
                mu = VacancyTagLinkUpdateMapper()
                rep = self.__uow.tag_vacancies

                len_tags = await add_ids(
                    self.__uow, rep, id, tags, m, mu, vacancy_id=id
                )
                len_tag_names = await add_names(
                    self.__uow, rep, id, tag_names, m, tm, mu, vacancy_id=id
                )
                return self.__gen_msg(len_tags, len_tag_names)

            except UniqueViolationException as e:
                raise BadRequestException(ADD_TAG_UNIC_EXCEPTION) from e
            except (GetItemByIdException, GetOneItemException) as e:
                raise AnyServiceException(GET_TAG_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_TAG_EXCEPTION) from e

    async def delete_vacancy_tag_links(self, id: int, tag_id: int):
        async with self.__uow:
            try:
                await self.__uow.tag_vacancies.delete(vacancy_id=id, tag_id=tag_id)
                await self.__uow.commit()
                return MessageSchema(message=DELETE_TAG_SUCCESS)
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_TAG_EXCEPTION) from e

    async def post_activity_tag_links(
        self,
        id: int,
        tags: list[SimpleTagCreateId] | None,
        tag_names: list[SimpleTagCreateName] | None,
    ):
        async with self.__uow:
            try:
                m = ActivityTagLinkInputMapper()
                tm = TagInputMapper()
                rep = self.__uow.tag_activities

                len_tags = await add_ids(self.__uow, rep, id, tags, m, activity_id=id)
                len_tag_names = await add_names(
                    self.__uow, rep, id, tag_names, m, tm, activity_id=id
                )
                return self.__gen_msg(len_tags, len_tag_names)

            except UniqueViolationException as e:
                raise BadRequestException(ADD_TAG_UNIC_EXCEPTION) from e
            except (GetItemByIdException, GetOneItemException) as e:
                raise AnyServiceException(GET_TAG_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_TAG_EXCEPTION) from e

    async def delete_activity_tag_links(self, id: int, tag_id: int):
        async with self.__uow:
            try:
                await self.__uow.tag_activities.delete(activity_id=id, tag_id=tag_id)
                await self.__uow.commit()
                return MessageSchema(message=DELETE_TAG_SUCCESS)
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_TAG_EXCEPTION) from e

    async def delete_user_tag_links(self, id: int, tag_id: int):
        async with self.__uow:
            try:
                await self.__uow.tag_users.delete(user_id=id, tag_id=tag_id)
                await self.__uow.commit()
                return MessageSchema(message=DELETE_TAG_SUCCESS)
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_TAG_EXCEPTION) from e

    async def post_user_tag_links(
        self,
        id: int,
        tags: list[TagCreateIdSchema] | None,
        tag_names: list[TagCreateNameSchema] | None,
    ):
        async with self.__uow:
            try:
                m = UserTagLinkInputMapper()
                tm = TagInputMapper()
                mu = UserTagLinkUpdateMapper()
                rep = self.__uow.tag_users

                len_tags = await add_ids(self.__uow, rep, id, tags, m, mu, user_id=id)
                len_tag_names = await add_names(
                    self.__uow, rep, id, tag_names, m, tm, mu, user_id=id
                )
                return self.__gen_msg(len_tags, len_tag_names)

            except UniqueViolationException as e:
                raise BadRequestException(ADD_TAG_UNIC_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_TAG_FOREIGN_KEY_EXCEPTION) from e
            except (GetItemByIdException, GetOneItemException) as e:
                raise AnyServiceException(GET_TAG_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_TAG_EXCEPTION) from e

    def __gen_msg(self, len_tags, len_tag_names):
        is_lot = (len_tags + len_tag_names) > 1
        lot_1 = "и" if is_lot else ""
        lot_2 = "ы" if is_lot else ""
        return MessageSchema(message=ADD_TAG_SUCCESS.format(lot_1, lot_2))
