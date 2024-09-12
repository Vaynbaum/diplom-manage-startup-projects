from fastapi import Depends

from src.other.service import OtherService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *


def create_other_service(uow: IUnitOfWork = Depends(create_uow)):
    return OtherService(uow)
