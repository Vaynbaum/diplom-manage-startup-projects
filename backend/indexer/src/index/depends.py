from fastapi import Depends

from src.common.depends import create_uow
from src.common.services.unit_of_work import IUnitOfWork
from src.index.service import IndexService


def create_index_service(uow: IUnitOfWork = Depends(create_uow)):
    return IndexService(uow)
