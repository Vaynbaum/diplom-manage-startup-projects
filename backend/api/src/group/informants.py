from src.authorization.exceptions import NoAccessAuthorizationException
from src.authorization.informants import IResourceInformant, ISubjectInformant
from src.authorization.schemas import *
from src.common.exceptions import NotFoundException
from src.database.exceptions import GetItemByIdException
from src.common.services.unit_of_work import IUnitOfWork
from src.group.phrases import ROLE_NOT_FOUND
from src.token.schemas import InpDataInform
from src.user.exceptions import GetUserByIdException


class GroupUserInformant(ISubjectInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> SubjectData:
        try:
            data = SubjectData(**inp_data.token_data.dict())
            group_id = inp_data.resource.get("group_id", None)

            if group_id:
                group_user = await uow.group_users.get_one(
                    group_id=group_id, user_id=inp_data.token_data.id
                )
                if group_user:
                    data.details = {"role_group": group_user.role_id}
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e


class RoleGroupUserInformant(ISubjectInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> SubjectData:
        try:
            it = inp_data.token_data
            data = SubjectData(**it.dict())
            role_id = inp_data.resource.get("role_id", None)

            if role_id:
                role = await uow.group_roles.get_by_id(role_id)
                if not role:
                    raise NotFoundException(ROLE_NOT_FOUND) from None
                if role.is_common:
                    raise NoAccessAuthorizationException() from None

                group_user = await uow.group_users.get_one(
                    group_id=role.group_id, user_id=it.id
                )
                if group_user:
                    data.details = {"role_group": group_user.role_id}
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e


class RoleGroupUserAssignInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        try:
            r = inp_data.resource
            data = ResourceRoleData(**r)
            group_id = inp_data.resource.get("group_id", None)
            user_id = inp_data.resource.get("user_id", None)
            role_id = inp_data.resource.get("role_id", None)

            if group_id:
                group_user = await uow.group_users.get_one(
                    group_id=group_id, user_id=user_id
                )
                if group_user:
                    data.details = {
                        "role_user": group_user.role_id,
                        "role_group": role_id,
                    }
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e


class ResGroupUserInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        try:
            r = inp_data.resource
            data = ResourceRoleData(**r)
            group_id = inp_data.resource.get("group_id", None)
            user_id = inp_data.resource.get("user_id", None)

            if group_id:
                group_user = await uow.group_users.get_one(
                    group_id=group_id, user_id=user_id
                )
                if group_user:
                    data.details = {"role_user": group_user.role_id}
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e


class ResVacancyInformant(ISubjectInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> SubjectData:
        try:
            data = SubjectData(**inp_data.token_data.dict())
            vacancy_id = inp_data.resource.get("vacancy_id", None)

            if vacancy_id:
                vacancy = await uow.vacancies.get_by_id(vacancy_id)

                if vacancy:
                    group_user = await uow.group_users.get_one(
                        group_id=vacancy.group_id, user_id=inp_data.token_data.id
                    )
                    if group_user:
                        data.details = {"role_group": group_user.role_id}
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e
