from src.database.base import AsyncSessionMaker
from src.token.token import TokenService
from src.common.services.unit_of_work import UnitOfWork


def create_uow():
    return UnitOfWork(AsyncSessionMaker)


def create_token_service():
    return TokenService()
