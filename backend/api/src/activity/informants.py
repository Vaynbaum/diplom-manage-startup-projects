from src.authorization.informants import IResourceInformant, ISubjectInformant
from src.authorization.schemas import *
from src.database.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform


class ActivityGroupInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        activity_id = inp_data.resource.get("activity_id", None)
        group_id = inp_data.resource.get("group_id", None)

        if activity_id and group_id:
            link = await uow.activity_requests.get_one(
                activity_id=activity_id, group_id=group_id
            )
            if link:
                data.details = {"status": link.status_id}
        return data


class ActivityGroupAndActivityInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        activity_id = inp_data.resource.get("activity_id", None)
        group_id = inp_data.resource.get("group_id", None)

        if activity_id and group_id:
            activity = await uow.activities.get_by_id(activity_id)
            if activity:
                data.owner_id = activity.creater_id

            link = await uow.activity_requests.get_one(
                activity_id=activity_id, group_id=group_id
            )
            if link:
                data.details = {"status": link.status_id}
        return data


class ResActivityGroupLinkInformant(ISubjectInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> SubjectData:
        data = SubjectData(**inp_data.token_data.dict())
        activity_id = inp_data.resource.get("activity_id", None)

        if activity_id:
            activity_db = await uow.activities.get_by_id(activity_id)

            if activity_db and activity_db.group_id:
                group_user = await uow.group_users.get_one(
                    group_id=activity_db.group_id, user_id=inp_data.token_data.id
                )
                if group_user:
                    data.details = {"role_group": group_user.role_id}
        return data


class ResTaskActivityGroupLinkInformant(ISubjectInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> SubjectData:
        data = SubjectData(**inp_data.token_data.dict())
        task_id = inp_data.resource.get("task_id", None)

        if task_id:
            task_db = await uow.activity_tasks.get_by_id(task_id)

            if task_db:
                activity_db = await uow.activities.get_by_id(task_db.activity_id)
                if activity_db and activity_db.group_id:
                    group_user = await uow.group_users.get_one(
                        group_id=activity_db.group_id, user_id=inp_data.token_data.id
                    )
                    if group_user:
                        data.details = {"role_group": group_user.role_id}
        return data


class ResTaskActivityInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        task_id = inp_data.resource.get("task_id", None)

        if task_id:
            task_db = await uow.activity_tasks.get_by_id(task_id)
            if task_db:
                activity_db = await uow.activities.get_by_id(task_db.activity_id)
                if activity_db:
                    data.owner_id = activity_db.creater_id
        return data


class ResTaskUserActivityInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        task_id = inp_data.resource.get("task_id", None)
        user_id = inp_data.resource.get("user_id", None)

        if task_id and user_id:
            data.details = {"user_id": user_id}
            task_db = await uow.activity_tasks.get_by_id(task_id)
            if task_db:
                activity_db = await uow.activities.get_by_id(task_db.activity_id)
                if activity_db:
                    data.owner_id = activity_db.creater_id
                    user_db = await uow.users.get_by_id(user_id)
                    if user_db and activity_db.group_id:
                        user_link = await uow.group_users.get_one(
                            user_id=user_id, group_id=activity_db.group_id
                        )
                        if user_link:
                            data.details["role_group"] = user_link.role_id
        return data


class ResTaskActivityGroupLinkStatusInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        task_id = inp_data.resource.get("task_id", None)

        if task_id:
            task_db = await uow.activity_tasks.get_by_id(task_id)
            if task_db:
                activity_db = await uow.activities.get_by_id(task_db.activity_id)
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
                    ass = await uow.activity_task_assignments.get_one(
                        user_id=inp_data.token_data.id, task_id=task_id
                    )
                    if ass:
                        data.details["is_assign"] = True
        return data


class ResTaskActivityGetInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        activity_id = inp_data.resource.get("activity_id", None)

        if activity_id:
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
                asses = await uow.activity_task_assignments.get_all(
                    user_id=inp_data.token_data.id, activity_id=activity_id
                )
                if len(asses) > 0:
                    data.details["ass_id"] = [a.task_id for a in asses]
                    data.details["is_assign"] = True
        return data
