from fastapi import Depends
from src.authorization.depends import FactoryAuthorizationService
from src.file.depends import create_file_service
from src.file.service import FileService
from src.group.informants import *

from src.post.informants import *
from src.post.service import PostService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *


def create_owner_informant():
    return OwnerInformant()


def create_post_owner_informant():
    return PostOwnerInformant()


def create_post_service(uow: IUnitOfWork = Depends(create_uow)):
    return PostService(uow)


factory_res_owner_auth = FactoryAuthorizationService(
    resource_informant=create_owner_informant()
)
factory_res_post_owner_auth = FactoryAuthorizationService(
    resource_informant=create_post_owner_informant()
)
