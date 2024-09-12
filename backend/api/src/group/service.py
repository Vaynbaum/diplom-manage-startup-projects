from fastapi import UploadFile
from src.common.consts import RANK_FUSION_SCORE
from src.common.schemas import *
from src.database.repositories.generic import GenericRepository
from src.file.service import FileService
from src.group.consts import *
from src.group.phrases import *
from src.authorization.schemas import ResultCheck, SubjectData
from src.group.mappers import *
from src.group.schemas import *
from src.authentication.exceptions import *
from src.database.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.database.models import *
from src.common.utils import *
from src.post.mappers import PostHideMapper, PostTagLinkInputMapper
from src.tag.mappers import *
from src.user.mappers import *
from src.user.phrases import *
from src.config import TypesenseCon, settings


class GroupService:
    def __init__(self, uow: IUnitOfWork, file_service: FileService):
        self.__uow = uow
        self.__file_service = file_service

    async def get_all_types(self) -> ResponseItemsSchema[GroupTypeSchema]:
        async with self.__uow:
            try:
                types = await self.__uow.group_types.get_all()
                m = GTypeDBMapper()
                return process_items_from_db(types, GTYPES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(GTYPES_EXCEPTION) from e

    async def create_group(self, group: GroupCreateSchema, subject_data: SubjectData):
        async with self.__uow:
            try:
                group_db = GroupInputMapper().mapping(group, subject_data.id)
                group = await self.__uow.groups.add(group_db)

                text = GROUP_POST.format(group.name)
                post_db = PostHideMapper().mapping(text, 2, group_id=group.id)
                post_db = await self.__uow.posts.add(post_db)
                await self.__uow.commit()
                group = GroupDBDBMapper().mapping(group)
                return group
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_GROUP_TYPE_ID_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_GROUP_FAILED) from e

    async def update_group(self, data: GroupUpdateSchema):
        async with self.__uow:
            try:
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                group_db = GroupUpdInputMapper().mapping(data, group_db)
                await self.__uow.groups.update(group_db)
                await self.__uow.commit()
            except GetItemByIdException as e:
                raise AnyServiceException(GROUP_EXCEPTION) from e
            except UniqueViolationException as e:
                raise BadRequestException(USERNAME_NOT_UNIQUE) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(TYPE_NO_EXIST) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPDATE_GROUP_EXCEPTION) from e

            try:
                if data.delete_contacts:
                    for contact_link_id in data.delete_contacts:
                        await self.__uow.group_contacts.delete(id=contact_link_id)

                if data.add_contacts:
                    contact_m = ContactGroupInputMapper()
                    for contact_link in data.add_contacts:
                        contact_db = contact_m.mapping(contact_link, group_db.id)
                        await self.__uow.group_contacts.add(contact_db)

                await self.__uow.commit()
                return MessageSchema(message=GROUP_UPDATE_SUCCESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(TYPE_CONTACT_NO_EXIST) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_CONTACT_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_CONTACT_EXCEPTION) from e

    async def delete_group(self, group_id: int):
        async with self.__uow:
            try:
                group_db = await self.__uow.groups.get_by_id(group_id)
                ava_id = AvatarDBMapper().mapping(group_db.avatar).id
                decoration_id = DecorationDBMapper().mapping(group_db.decoration).id

                res = await self.__uow.groups.delete(id=group_id)
                if not res:
                    raise BadRequestException(GROUP_NOT_FOUND) from None
                await self.__uow.commit()
                return (MessageSchema(message=DELETE_GROUP), ava_id, decoration_id)
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_GROUP_EXCEPTION) from e

    async def get_all(
        self,
        limit: int,
        offset: int,
        substr: str | None,
        type_ids: list[int] | None,
        tag_ids: list[int],
        is_vac: bool,
        is_act: bool,
    ):
        async with self.__uow:
            try:
                ids = None
                if substr:
                    substr = clear_substr(substr)
                    ids = self.__search_group(substr)
                groups = await self.__uow.groups.get_all(
                    offset, limit, ids, type_ids, tag_ids, is_vac, is_act
                )
                m = GroupDBMapper()
                return process_items_from_db(groups, GROUPS_NOT_FOUND, m, offset=offset)
            except GetAllItemsException as e:
                raise AnyServiceException(GROUPS_EXCEPTION) from e

    async def get_my_groups(self, id: int):
        async with self.__uow:
            try:
                groups = await self.__uow.groups.get_all(creater_id=id)
                m = SimpleGroupDBMapper()
                return process_items_from_db(groups, GROUPS_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(GROUPS_EXCEPTION) from e

    async def get_one(self, id: int | None, username: str | None):
        async with self.__uow:
            try:
                if id is None and username is None:
                    raise BadRequestException(ID_USERNAME_NO) from None
                group = await self.__uow.groups.get_one(id, username)
                return process_item_from_db(
                    group, GROUP_NOT_FOUND, GroupWithUsersDBMapper()
                )
            except GetOneItemException as e:
                raise AnyServiceException(GROUP_EXCEPTION) from e

    async def sub_group(self, group_id: int, user_id: int):
        async with self.__uow:
            try:
                group_user_db = GroupUserInputMapper().mapping(
                    user_id, group_id=group_id
                )
                await self.__uow.group_users.add(group_user_db)
                await self.__uow.commit()
                return MessageSchema(message=SUB_SUCCEESS)
            except UniqueViolationException as e:
                raise BadRequestException(GROUP_SUBSCRIPTION_EXIST) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(SUB_EXCEPTION) from e

    async def unsub_group(self, group_id: int, user_id: int):
        async with self.__uow:
            try:
                res = await self.__uow.group_users.delete(
                    group_id=group_id, user_id=user_id
                )
                if not res:
                    raise BadRequestException(SUBSCRIPTION_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=UNSUB_SUCCEESS)
            except DeleteItemException as e:
                raise AnyServiceException(UNSUB_EXCEPTION) from e

    async def get_roles(self, group_id: int, is_common: bool):
        async with self.__uow:
            try:
                roles = await self.__uow.group_roles.get_all(
                    group_id=group_id, is_common=is_common
                )
                m = GroupRoleDBMapper()
                return process_items_from_db(roles, GROUP_ROLES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(GROUP_ROLES_EXCEPTION) from e

    async def create_role(self, role: GroupRoleCreateSchema):
        async with self.__uow:
            try:
                role_db = GroupRoleInputMapper().mapping(role)
                role = await self.__uow.group_roles.add(role_db)
                await self.__uow.commit()
                return MessageSchema(message=ROLE_SUCCEESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(ROLE_EXCEPTION) from e

    async def update_role(self, role: GroupRoleUpdateSchema):
        async with self.__uow:
            try:
                role_db = await self.__uow.group_roles.get_by_id(role.id)
                role_db = GroupRoleUpdInputMapper().mapping(role, role_db)
                await self.__uow.group_roles.update(role_db)
                await self.__uow.commit()
                return MessageSchema(message=ROLE_UPD_SUCCEESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_NOT_FOUND) from e
            except GetItemByIdException as e:
                raise AnyServiceException(ROLE_UPD_GET_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(ROLE_UPD_EXCEPTION) from e

    async def delete_role(self, id: int):
        async with self.__uow:
            try:
                res = await self.__uow.group_roles.delete(id=id)
                if not res:
                    raise BadRequestException(ROLE_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=ROLE_DELETE_SUCCEESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(ROLE_LINKED) from e
            except DeleteItemException as e:
                raise AnyServiceException(ROLE_DELETE_EXCEPTION) from e

    async def assign_role(self, data: GroupRoleAssignSchema):
        async with self.__uow:
            try:
                group_user = await self.__uow.group_users.get_one(
                    group_id=data.group_id,
                    user_id=data.user_id,
                )
                group_user.role_id = data.role_id
                await self.__uow.group_users.update(group_user)
                await self.__uow.commit()
                role_db = await self.__uow.group_roles.get_by_id(data.role_id)
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                return (
                    MessageSchema(message=ASSIGN_ROLE_SUCCEESS),
                    role_db.name,
                    group_db.name,
                )
            except ForeignKeyViolationException as e:
                raise BadRequestException(ROLE_NOT_FOUND_SUCCEESS) from e
            except GetOneItemException as e:
                raise AnyServiceException(ASSIGN_ROLE_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ASSIGN_ROLE_EXCEPTION) from e

    async def post_avatar(self, file: UploadFile, group_id: int, token: str):
        async with self.__uow:
            try:
                group_db = await self.__uow.groups.get_by_id(group_id)
                ava_id = AvatarDBMapper().mapping(group_db.avatar).id
                res = await self.__file_service.post_file(file, token)
                group_db.avatar = AvatarInputMapper().mapping(res)
                await self.__uow.groups.update(group_db)
                await self.__uow.commit()
                return AvatarSchema(**group_db.avatar), ava_id
            except GetItemByIdException as e:
                raise AnyServiceException(GROUP_EXCEPTION) from e

    async def post_cover(self, file: UploadFile, group_id: int, token: str):
        async with self.__uow:
            try:
                group_db = await self.__uow.groups.get_by_id(group_id)
                decoration_id = DecorationDBMapper().mapping(group_db.decoration).id
                res = await self.__file_service.post_file(file, token)
                group_db.decoration = DecorationInputMapper().mapping(res)
                await self.__uow.groups.update(group_db)
                await self.__uow.commit()
                return DecorationSchema(**group_db.decoration), decoration_id
            except GetItemByIdException as e:
                raise AnyServiceException(GROUP_EXCEPTION) from e

    async def kick_user(self, group_id: int, user_id: int):
        async with self.__uow:
            try:
                res = await self.__uow.group_users.delete(
                    group_id=group_id, user_id=user_id
                )
                if not res:
                    raise BadRequestException(ROLE_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=GROUP_USER_SUCCEESS)
            except DeleteItemException as e:
                raise AnyServiceException(GROUP_USER_EXCEPTION) from e

    async def post_vacancy(self, vacancy: VacancyCreateSchema):
        async with self.__uow:
            try:
                vacancy_db = VacancyInputMapper().mapping(vacancy)
                await self.__uow.vacancies.add(vacancy_db)
                await self.__uow.commit()

                m = VacancyTagLinkInputMapper()
                tm = TagInputMapper()
                mu = VacancyTagLinkUpdateMapper()
                rep = self.__uow.tag_vacancies

                await add_ids(
                    self.__uow,
                    rep,
                    vacancy_db.id,
                    vacancy.tag_ids,
                    m,
                    mu,
                    vacancy_id=vacancy_db.id,
                )
                await add_names(
                    self.__uow,
                    rep,
                    vacancy_db.id,
                    vacancy.tag_names,
                    m,
                    tm,
                    mu,
                    vacancy_id=vacancy_db.id,
                )

                m = PostTagLinkInputMapper()
                rep = self.__uow.tag_posts

                group = await self.__uow.groups.get_by_id(vacancy.group_id)
                text = GROUP_VACANCY_POST.format(group.name, vacancy.name)
                post_db = PostHideMapper().mapping(text, 3, group_id=group.id)
                post_db = await self.__uow.posts.add(post_db)

                await add_ids(
                    self.__uow, rep, post_db.id, vacancy.tag_ids, m, post_id=post_db.id
                )
                await add_names(
                    self.__uow,
                    rep,
                    post_db.id,
                    vacancy.tag_names,
                    m,
                    tm,
                    post_id=post_db.id,
                )
                await self.__uow.commit()
                return MessageSchema(message=VACANCY_SUCCESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(VACANCY_EXCEPTION) from e

    async def post_invite(self, data: CreateGroupInviteShema, id: int):
        async with self.__uow:
            try:
                if id == data.user_id:
                    raise BadRequestException(SELF_INVITE) from None
                invite = GroupInviteInputMapper().mapping(data)
                await self.__uow.group_invites.add(invite)
                await self.__uow.commit()

                group_db = await self.__uow.groups.get_by_id(data.group_id)
                user_db = await self.__uow.user_abstracts.get_by_id(id)
                u = f"{user_db.lastname} {user_db.firstname}"
                return MessageSchema(message=INVITE_SUCCEESS), group_db.name, u
            except UniqueViolationException as e:
                raise BadRequestException(INVITE_EXIST) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_USER_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(INVITE_EXCEPTION) from e

    async def delete_invite(self, group_id: int, user_id: int):
        async with self.__uow:
            try:
                res = await self.__uow.group_invites.delete(
                    group_id=group_id, user_id=user_id
                )
                if not res:
                    raise BadRequestException(INVITE_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=INVITE_DELETE_SUCCEESS)
            except DeleteItemException as e:
                raise AnyServiceException(INVITE_DELETE_EXCEPTION) from e

    async def put_invite(self, data: ResponseInviteGroupInviteShema, id: int):
        async with self.__uow:
            try:
                invite = await self.__uow.group_invites.get_one(
                    user_id=id, group_id=data.group_id
                )
                if invite is None:
                    raise AnyServiceException(INVITE_NOT_FOUND) from None

                invite.is_approved = data.is_approved
                group_user_db = await self.__uow.group_users.get_one(
                    group_id=data.group_id, user_id=id
                )
                if data.is_approved:
                    if group_user_db:
                        group_user_db.role_id = ROLE_ID_GROUP_PART_TEAM
                        await self.__uow.group_users.update(group_user_db)
                    else:
                        group_user_db = GroupUserInputMapper().mapping(
                            id, ROLE_ID_GROUP_PART_TEAM, data.group_id
                        )
                        await self.__uow.group_users.add(group_user_db)
                await self.__uow.commit()
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                user_db = await self.__uow.user_abstracts.get_by_id(id)
                u = f"{user_db.lastname} {user_db.firstname}"
                return (
                    MessageSchema(
                        message=INVITE_APP if data.is_approved else INVITE_REJ
                    ),
                    group_db.creater_id,
                    u,
                    group_db.name,
                )
            except GetOneItemException as e:
                raise AnyServiceException(GET_INVITE_EXCEPT) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPD_INVITE_EXCEPT) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ROLE_NOT_FOUND)
            except AddItemException as e:
                raise AnyServiceException(UPD_INVITE_EXCEPT) from e

    async def delete_vacancy_response(self, vac_id: int, id: int):
        async with self.__uow:
            try:
                res = await self.__uow.vacancy_users.delete(
                    vacancy_id=vac_id, user_id=id
                )
                if not res:
                    raise BadRequestException(RESPONSES_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=RESPONSES_DELETE)
            except DeleteItemException as e:
                raise AnyServiceException(RESPONSES_DELETE_EXCEPT) from e

    async def post_vacancy_response(self, vac_id: int, id: int):
        async with self.__uow:
            try:
                link = VacancyUserInputMapper().mapping(vac_id, id)
                await self.__uow.vacancy_users.add(link)
                await self.__uow.commit()
                vacancy_db = await self.__uow.vacancies.get_by_id(vac_id)
                group_db = await self.__uow.groups.get_by_id(vacancy_db.group_id)
                return (
                    MessageSchema(message=RESPONSE_SUCCEESS),
                    vacancy_db.name,
                    group_db.creater_id,
                )
            except ForeignKeyViolationException as e:
                raise BadRequestException(VAC_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(RESPONSE_EXCEPTION) from e

    async def get_vacancy_responses(self, vacancy_id: int, limit: int, offset: int):
        async with self.__uow:
            try:
                links = await self.__uow.vacancy_users.get_all_by_vac(
                    vacancy_id, limit, offset
                )
                m = VacancyUser2DBMapper()
                return process_items_from_db(
                    links, RESPONSE_NOT_FOUND, m, offset=offset
                )
            except GetAllItemsException as e:
                raise AnyServiceException(GROUPS_EXCEPTION) from e

    async def put_vacancy(self, vacancy: VacancyUpdateSchema):
        async with self.__uow:
            try:
                vacancy_db = await self.__uow.vacancies.get_by_id(vacancy.vacancy_id)
                vacancy_db = VacancyUpdInputMapper().mapping(vacancy, vacancy_db)
                await self.__uow.vacancies.update(vacancy_db)
                await self.__uow.commit()

                for id in vacancy.delete_ids:
                    await self.__uow.tag_vacancies.delete(
                        vacancy_id=vacancy_db.id, tag_id=id
                    )
                await self.__uow.commit()

                m = VacancyTagLinkInputMapper()
                tm = TagInputMapper()
                mu = VacancyTagLinkUpdateMapper()
                rep = self.__uow.tag_vacancies

                await add_ids(
                    self.__uow,
                    rep,
                    vacancy_db.id,
                    vacancy.tag_ids,
                    m,
                    mu,
                    vacancy_id=vacancy_db.id,
                )
                await add_names(
                    self.__uow,
                    rep,
                    vacancy_db.id,
                    vacancy.tag_names,
                    m,
                    tm,
                    mu,
                    vacancy_id=vacancy_db.id,
                )

                return MessageSchema(message=VAC_UPD_SUCCEESS)
            except GetItemByIdException as e:
                raise AnyServiceException(VAC_UPD_GET_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(VAC_UPD_EXCEPTION) from e

    async def delete_vacancy(self, id: int):
        async with self.__uow:
            try:
                res = await self.__uow.vacancies.delete(id=id)
                if not res:
                    raise BadRequestException(VAC_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=VAC_DELETE_SUCCEESS)
            except DeleteItemException as e:
                raise AnyServiceException(VAC_DELETE_EXCEPTION) from e

    async def get_vacancy_one(self, id: int):
        async with self.__uow:
            try:
                vacancy = await self.__uow.vacancies.get_one(id)
                return process_item_from_db(vacancy, VAC_NOT_FOUND, VacancyDBMapper())
            except GetOneItemException as e:
                raise AnyServiceException(GROUP_EXCEPTION) from e

    async def post_vacancy_response_approve(self, data: CreateVacancyResponseApprove):
        async with self.__uow:
            try:
                link_db = await self.__uow.vacancy_users.get_one(
                    vacancy_id=data.vacancy_id, user_id=data.user_id
                )
                vacancy_db = await self.__uow.vacancies.get_by_id(data.vacancy_id)
                group_user_db = await self.__uow.group_users.get_one(
                    group_id=vacancy_db.group_id, user_id=data.user_id
                )
                link_db.is_approved = True
                await self.__uow.vacancy_users.update(link_db)

                if group_user_db:
                    group_user_db.role_id = ROLE_ID_GROUP_PART_TEAM
                    await self.__uow.group_users.update(group_user_db)
                else:
                    group_user_db = GroupUserInputMapper().mapping(
                        data.user_id, ROLE_ID_GROUP_PART_TEAM, vacancy_db.group_id
                    )
                    await self.__uow.group_users.add(group_user_db)

                await self.__uow.commit()
                return MessageSchema(message=RESPONSE_APPROVED), vacancy_db.name
            except GetOneItemException as e:
                raise AnyServiceException(RESPONSE_OR_GROUP_GET_ERROR) from e
            except GetItemByIdException as e:
                raise AnyServiceException(VAC_UPD_GET_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ROLE_NOT_FOUND)
            except AddItemException as e:
                raise AnyServiceException(RESPONSE_APPROVED_ERROR) from e
            except UpdateItemException as e:
                raise AnyServiceException(RESPONSE_APPROVED_ERROR) from e

    async def post_vacancy_response_reject(self, data: CreateVacancyResponseApprove):
        async with self.__uow:
            try:
                link_db = await self.__uow.vacancy_users.get_one(
                    vacancy_id=data.vacancy_id, user_id=data.user_id
                )
                vacancy_db = await self.__uow.vacancies.get_by_id(data.vacancy_id)
                link_db.is_approved = False
                await self.__uow.vacancy_users.update(link_db)
                await self.__uow.commit()
                return MessageSchema(message=RESPONSE_REJECTED), vacancy_db.name
            except GetOneItemException as e:
                raise AnyServiceException(RESPONSE_GET_ERROR) from e
            except UpdateItemException as e:
                raise AnyServiceException(RESPONSE_REJECT_ERROR) from e
    def __search_group(self, substr: str):
        res = TypesenseCon.collections[NAME_SCHEMA_GROUP].documents.search(
            {
                "q": substr,
                "query_by": "name,note,username,embedding",
                "exclude_fields": "embedding",
            }
        )
        return [
            h["document"]["group_id"]
            for h in res["hits"]
            if h["hybrid_search_info"]["rank_fusion_score"] >RANK_FUSION_SCORE
        ]
