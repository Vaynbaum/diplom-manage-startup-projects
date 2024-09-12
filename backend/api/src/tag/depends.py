from fastapi import Depends

from src.authorization.depends import FactoryAuthorizationService
from src.tag.informants import ResActivityInformant
from src.tag.service import TagService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *


def create_tag_service(uow: IUnitOfWork = Depends(create_uow)):
    return TagService(uow)


def create_res_activity_informant():
    return ResActivityInformant()


factory_res_activity_auth = FactoryAuthorizationService(
    resource_informant=create_res_activity_informant()
)
