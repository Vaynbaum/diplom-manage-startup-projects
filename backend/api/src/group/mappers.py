from datetime import datetime
from src.common.utils import keySortCreatedAt
from src.group.consts import ROLE_ID_GR_CREATER, ROLE_ID_GROUP_OBSERER
from src.group.schemas import *
from src.database.models import *
from src.common.mappers import *


class VacancyUpdInputMapper(BaseMapper[VacancyUpdateSchema, Vacancy]):
    def mapping(self, vacancy: VacancyUpdateSchema, vacancy_db: Vacancy):
        if not vacancy_db.is_active and vacancy.is_active:
            vacancy_db.created_at = datetime.now()
        vacancy_db.is_active = vacancy.is_active
        vacancy_db.description = vacancy.description
        vacancy_db.name = vacancy.name

        return vacancy_db


class VacancyInputMapper(BaseMapper[VacancyCreateSchema, Vacancy]):
    def mapping(self, vacancy: VacancyCreateSchema):
        return Vacancy(
            name=vacancy.name,
            description=vacancy.description,
            group_id=vacancy.group_id,
            is_active=True,
        )


class VacancyDBMapper(SimpleDBMapper[Vacancy, VacancySchema]):
    def __init__(self):
        super().__init__(VacancySchema)


class GroupUserInputMapper(BaseMapper[int, GroupUser]):
    def mapping(
        self,
        user_id: int,
        role_id: int = ROLE_ID_GROUP_OBSERER,
        group_id: int | None = None,
    ):
        if group_id:
            return GroupUser(group_id=group_id, user_id=user_id, role_id=role_id)
        else:
            return GroupUser(user_id=user_id, role_id=role_id)


class ContactGroupInputMapper(BaseMapper[ContactAddSchema, ContactGroup]):
    def mapping(self, link: ContactAddSchema, group_id: int):
        return ContactGroup(
            group_id=group_id, value=link.value, contact_id=link.contact_id
        )


class GroupUpdInputMapper(BaseMapper[GroupUpdateSchema, Group]):
    def mapping(self, data: GroupUpdateSchema, group_db: Group):
        if data.username:
            group_db.username = data.username
        elif not group_db.username:
            group_db.username = f"id{group_db.id}"

        if data.name and group_db.name != data.name:
            group_db.name = data.name
        if data.note and group_db.note != data.note:
            group_db.note = data.note
        if data.type_id and group_db.type_id != data.type_id:
            group_db.type_id = data.type_id

        return group_db


class GroupInviteInputMapper(BaseMapper[CreateGroupInviteShema, GroupInvite]):
    def mapping(self, group: CreateGroupInviteShema):
        return GroupInvite(group_id=group.group_id, user_id=group.user_id)


class GroupInputMapper(BaseMapper[GroupCreateSchema, Group]):
    def mapping(self, group: GroupCreateSchema, creater_id: int):
        group_user = GroupUserInputMapper().mapping(creater_id, ROLE_ID_GR_CREATER)
        return Group(
            name=group.name,
            note=group.note,
            type_id=group.type_id,
            creater_id=creater_id,
            decoration={},
            avatar={},
            users=[group_user],
        )


class GTypeDBMapper(SimpleDBMapper[GroupType, GroupTypeSchema]):
    def __init__(self):
        super().__init__(GroupTypeSchema)


class GroupDBDBMapper(SimpleDBMapper[Group, GroupDBSchema]):
    def __init__(self):
        super().__init__(GroupDBSchema)


class SimpleGroupDBMapper(SimpleDBMapper[Group, GroupDBSchema]):
    def __init__(self):
        super().__init__(GroupDBSchema)


# TmpGroupSchema
class GroupDBMapper(SimpleDBMapper[Group, GroupWithUserSchema]):
    def __init__(self):
        super().__init__(GroupWithUserSchema)


# GroupSchema
class GroupWithUsersDBMapper(BaseMapper[Group, FullGroupSchema]):
    def mapping(self, group: Group):
        p = FullGroupSchema.from_orm(group)

        for u in p.users:
            u.user = u.user.user_abstract
        p.users.sort(key=keySortCreatedAt)
        return p


class VacancyUser2DBMapper(BaseMapper[VacancyUser, VacancyUser2Schema]):
    def mapping(self, link: VacancyUser):
        l = VacancyUser2Schema.from_orm(link)
        l.user = l.user.user_abstract
        return l


class GroupRoleDBMapper(SimpleDBMapper[GroupRole, GroupRoleSchema]):
    def __init__(self):
        super().__init__(GroupRoleSchema)


class GroupRoleInputMapper(BaseMapper[GroupRoleCreateSchema, GroupRole]):
    def mapping(self, role: GroupRoleCreateSchema, is_common=False):
        return GroupRole(name=role.name, is_common=is_common, group_id=role.group_id)


class VacancyUserInputMapper(BaseMapper[int, VacancyUser]):
    def mapping(self, vac_id: int, id: int):
        return VacancyUser(vacancy_id=vac_id, user_id=id)


class GroupRoleUpdInputMapper(BaseMapper[GroupRoleUpdateSchema, GroupRole]):
    def mapping(self, role: GroupRoleUpdateSchema, role_db: GroupRole):
        role_db.name = role.name
        return role_db
