from fastapi import Depends

from src.common.services.unit_of_work import IUnitOfWork
from src.authorization.depends import FactoryAuthorizationService
from src.common.depends import *
from src.file.depends import create_file_service
from src.file.service import FileService
from src.user.service import UserService
from src.user.informants import UserAbstractInformant


def create_user_service(
    uow: IUnitOfWork = Depends(create_uow),
    file_service: FileService = Depends(create_file_service),
):
    return UserService(uow, file_service)


def create_user_abstract_informant():
    return UserAbstractInformant()


factory_res_profile_user_auth = FactoryAuthorizationService(
    resource_informant=create_user_abstract_informant()
)
