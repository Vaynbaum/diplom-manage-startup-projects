from fastapi import Depends
from src.authorization.depends import FactoryAuthorizationService
from src.file.depends import create_file_service
from src.file.service import FileService
from src.group.informants import *

from src.group.service import GroupService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *


def create_group_service(
    uow: IUnitOfWork = Depends(create_uow),
    file_service: FileService = Depends(create_file_service),
):
    return GroupService(uow, file_service)


def create_group_user_informant():
    return GroupUserInformant()


def create_role_group_user_informant():
    return RoleGroupUserInformant()


def create_role_group_user_assign_informant():
    return RoleGroupUserAssignInformant()


def create_res_group_user_informant():
    return ResGroupUserInformant()


def create_res_vacancy_informant():
    return ResVacancyInformant()


factory_res_group_auth = FactoryAuthorizationService(
    subject_informant=create_group_user_informant()
)
factory_res_role_group_auth = FactoryAuthorizationService(
    subject_informant=create_role_group_user_informant()
)
factory_res_role_group_assign_auth = FactoryAuthorizationService(
    resource_informant=create_role_group_user_assign_informant(),
    subject_informant=create_group_user_informant(),
)
factory_res_group_user_auth = FactoryAuthorizationService(
    resource_informant=create_res_group_user_informant(),
    subject_informant=create_group_user_informant(),
)
factory_res_vacancy_auth = FactoryAuthorizationService(
    subject_informant=create_res_vacancy_informant()
)
