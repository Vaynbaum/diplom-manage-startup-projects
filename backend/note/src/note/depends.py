from fastapi import Depends

from src.common.depends import create_token_service, create_uow
from src.common.services.unit_of_work import IUnitOfWork
from src.connect.service import ConnectionService
from src.note.service import NoteService
from src.token.const import ACCESS_TOKEN
from src.token.token import TokenService

ConnectService = ConnectionService()


def get_token(token: str, token_service: TokenService = Depends(create_token_service)):
    if token is None:
        return None
    return token_service.decode_token(token, ACCESS_TOKEN)


def get_message_service(uow: IUnitOfWork = Depends(create_uow)):
    return NoteService(uow, ConnectService)
