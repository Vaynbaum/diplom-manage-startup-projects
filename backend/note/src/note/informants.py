from src.authorization.informants import IResourceInformant
from src.authorization.schemas import *
from src.database.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform


class ResTaskActivityGetInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        activity_id = inp_data.resource.get("activity_id", None)
        message_id = inp_data.resource.get("message_id", None)
        if message_id:
            message_db = await uow.messages.get_by_id(message_id)
            activity_db = await uow.activities.get_by_id(message_db.activity_id)
            if message_db and activity_db:
                if activity_db.creater_id == inp_data.token_data.id:
                    data.owner_id = activity_db.creater_id
                else:
                    data.owner_id = message_db.sender_id

        elif activity_id:
            activity_db = await uow.activities.get_by_id(activity_id)
            if activity_db:
                data.owner_id = activity_db.creater_id
                data.details = {}
                if activity_db.group_id:
                    group_user = await uow.group_users.get_one(
                        group_id=activity_db.group_id,
                        user_id=inp_data.token_data.id,
                    )
                    if group_user:
                        data.details["role_group"] = group_user.role_id
        return data
