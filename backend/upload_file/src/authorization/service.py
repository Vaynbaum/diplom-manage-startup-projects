from src.authorization.exceptions import *
from src.authorization.checkers import *
from src.authorization.informants import *
from src.authorization.schemas import *
from src.database.exceptions import DBException
from src.token.const import ACCESS_TOKEN
from src.token.token import TokenService
from src.common.services.unit_of_work import IUnitOfWork


class AuthorizationService:
    def __init__(
        self,
        uow: IUnitOfWork,
        token_service: TokenService,
        resource_informant: IResourceInformant,
        action_informant: IActionInformant,
        subject_informant: ISubjectInformant,
    ):
        self.__uow = uow
        self.__token_service = token_service
        self.__checkers: list[BaseCheckerAuthService] = [
            RoleCheckerAuthService(),
            RoleOwnerCheckerAuthService(),
        ]
        self.__resource_informant = resource_informant
        self.__action_informant = action_informant
        self.__subject_informant = subject_informant

    async def check(self, action: str, token: str, **resource):
        try:
            token_data = self.__token_service.decode_token(token, ACCESS_TOKEN)
            async with self.__uow:
                subject_data = await self.__subject_informant.get(token_data)
                resource_data = await self.__resource_informant.get(
                    resource, self.__uow
                )
                action_data = await self.__action_informant.get(action)

                for checker in self.__checkers:
                    result: StatusAccess = checker.check(
                        action_data, resource_data, subject_data
                    )
                    if result.value:
                        return ResultCheck(resource=resource_data, subject=subject_data)
                raise NoAccessAuthorizationException() from None
        except DBException as db_e:
            raise DBAuthorizationException(DB_EXCEPTION) from db_e
