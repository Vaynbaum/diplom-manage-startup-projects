from src.authorization.informants import IResourceInformant
from src.authorization.schemas import *
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform


class OwnerInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        activity_id = inp_data.resource.get("activity_id", None)
        group_id = inp_data.resource.get("group_id", None)

        if group_id:
            group = await uow.groups.get_by_id(group_id)
            if group:
                data.owner_id = group.creater_id
        elif activity_id:
            activity = await uow.activities.get_by_id(activity_id)
            if activity:
                data.owner_id = activity.creater_id
        else:
            data.owner_id = inp_data.token_data.id
        return data


class PostOwnerInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        post_id = inp_data.resource.get("post_id", None)

        if post_id:
            post = await uow.posts.get_by_id(post_id)
            if post:
                if post.group:
                    data.owner_id = post.group.creater_id
                elif post.activity:
                    data.owner_id = post.activity.creater_id
                else:
                    data.owner_id = post.user_id

        return data
