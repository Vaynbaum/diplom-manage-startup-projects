from src.authorization.pickers import BasePicker
from src.authorization.exceptions import *
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
        pickers: list[BasePicker],
        token_service: TokenService,
        resource_informant: IResourceInformant,
        subject_informant: ISubjectInformant,
        action_informant: IActionInformant,
    ):
        self.__uow = uow
        self.__token_service = token_service
        self.__pickers = pickers
        self.__resource_informant = resource_informant
        self.__action_informant = action_informant
        self.__subject_informant = subject_informant

    def gen_token(self, data: TokenDataSchema):
        return self.__token_service.generate_tokens(data)

    async def check(self, action: str, token: str, **resource):
        try:
            token_data = self.__token_service.decode_token(token, ACCESS_TOKEN)
            inp = InpDataInform(action=action, resource=resource, token_data=token_data)
            async with self.__uow:
                sub_data = await self.__subject_informant.get(inp, self.__uow)
                res_data = await self.__resource_informant.get(inp, self.__uow)
                act_data = await self.__action_informant.get(inp)

                for picker in self.__pickers:
                    result: StatusAccess = picker.check(act_data, res_data, sub_data)
                    if result.value:
                        return ResultCheck(resource=res_data, subject=sub_data)
                raise NoAccessAuthorizationException() from None
        except DBException as db_e:
            raise DBAuthorizationException(DB_EXCEPTION) from db_e
