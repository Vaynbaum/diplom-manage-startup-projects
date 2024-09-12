from src.authorization.informants import IResourceInformant
from src.authorization.schemas import *
from src.database.exceptions import GetItemByIdException
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform
from src.user.exceptions import GetUserByIdException


class ResActivityInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        try:
            r = inp_data.resource
            data = ResourceRoleData(**r)
            activity_id = inp_data.resource.get("activity_id", None)

            if activity_id:
                activity = await uow.activities.get_by_id(activity_id)
                if activity:
                    data.owner_id = activity.creater_id
            return data
        except GetItemByIdException as e:
            raise GetUserByIdException() from e
