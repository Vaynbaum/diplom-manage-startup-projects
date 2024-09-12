from fastapi import Depends

from src.authorization.depends import FactoryAuthorizationService
from src.common.depends import create_token_service, create_uow
from src.common.services.unit_of_work import IUnitOfWork
from src.connect.service import ConnectionService
from src.message.informants import ResTaskActivityGetInformant
from src.message.service import MessageService
from src.token.const import ACCESS_TOKEN
from src.token.token import TokenService

ConnectService = ConnectionService()


def get_token(token: str, token_service: TokenService = Depends(create_token_service)):
    if token is None:
        return None
    return token_service.decode_token(token, ACCESS_TOKEN)


def create_task_activity_get_informant():
    return ResTaskActivityGetInformant()


def get_message_service(uow: IUnitOfWork = Depends(create_uow)):
    return MessageService(uow, ConnectService)


factory_res_task_activity_get_auth = FactoryAuthorizationService(
    resource_informant=create_task_activity_get_informant()
)
