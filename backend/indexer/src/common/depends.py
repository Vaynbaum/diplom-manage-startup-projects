from src.database.base import AsyncSessionMaker
from src.common.services.unit_of_work import UnitOfWork


def create_uow():
    return UnitOfWork(AsyncSessionMaker)