from src.authorization.informants import IResourceInformant
from src.authorization.schemas import *
from src.database.exceptions import GetItemByIdException
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform
from src.user.exceptions import GetUserByIdException, InvalidUserIdException


class UserAbstractInformant(IResourceInformant):
    async def get(self, data: InpDataInform, uow: IUnitOfWork) -> ResourceRoleData:
        try:
            r = data.resource
            id = r.get("id", None)
            username = r.get("username", None)
            data = ResourceRoleData(**r)

            if id or username:
                profile = await uow.user_abstracts.get_one_short(id, username)
                if profile is None:
                    raise InvalidUserIdException() from None
                data.owner_id = profile.id
                data.role_id = profile.role_id
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e
