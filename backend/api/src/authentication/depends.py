from fastapi import Depends

from src.authentication.service import AuthenticationService
from src.token.depends import create_token_service
from src.token.service import TokenService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *


def create_authentication_service(
    uow: IUnitOfWork = Depends(create_uow),
    token: TokenService = Depends(create_token_service),
):
    return AuthenticationService(uow, token)
