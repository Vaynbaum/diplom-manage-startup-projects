from fastapi import UploadFile
from src.common.consts import RANK_FUSION_SCORE
from src.common.schemas import *
from src.file.service import FileService
from src.activity.phrases import *
from src.authorization.schemas import ResultCheck, SubjectData
from src.activity.mappers import *
from src.activity.schemas import *
from src.authentication.exceptions import *
from src.database.exceptions import *
from src.common.services.unit_of_work import IUnitOfWork
from src.database.models import *
from src.common.utils import *
from src.group.consts import ROLE_ID_GR_CREATER, ROLE_ID_GROUP_ADMIN
from src.group.phrases import GROUP_NOT_FOUND
from src.post.mappers import PostHideMapper
from src.user.mappers import *
from src.user.phrases import *
from src.config import TypesenseCon, settings


class ActivityService:
    def __init__(self, uow: IUnitOfWork, file_service: FileService):
        self.__uow = uow
        self.__file_service = file_service

    async def create_activity(
        self, activity: ActivityCreateSchema, subject_data: SubjectData
    ):
        async with self.__uow:
            try:
                activity_db = ActivityInputMapper().mapping(activity, subject_data.id)
                activity = await self.__uow.activities.add(activity_db)

                text = ACTIVITY_POST.format(activity.name)
                post_db = PostHideMapper().mapping(text, 4, activity_id=activity.id)
                post_db = await self.__uow.posts.add(post_db)
                await self.__uow.commit()
                activity = ActivityDBMapper().mapping(activity)
                return activity
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_STATUS_ID_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_ACTIVITY_FAILED) from e

    async def get_all_status(self):
        async with self.__uow:
            try:
                statuses = await self.__uow.activity_statuses.get_all()
                m = AStatusDBMapper()
                return process_items_from_db(statuses, ASTATUSES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(ASTATUSES_EXCEPTION) from e

    async def get_all_directions(self):
        async with self.__uow:
            try:
                directions = await self.__uow.directions.get_all()
                m = DirectionDBMapper()
                d = process_items_from_db(directions, DIRECTIONS_NOT_FOUND, m, False)
                ind = [i for i, x in enumerate(d) if x.id == 17][0]
                d.append(d.pop(ind))
                return d
            except GetAllItemsException as e:
                raise AnyServiceException(DIRECTIONS_EXCEPTION) from e

    async def get_all(
        self,
        limit: int,
        offset: int,
        substr: str | None,
        status_ids: list[int] | None,
        direction_ids: list[int] | None,
        tag_ids: list[int] | None,
        is_group: bool,
    ):
        async with self.__uow:
            try:
                ids = None
                if substr:
                    substr = clear_substr(substr)
                    ids = self.__search_activity(substr)
                activities = await self.__uow.activities.get_all(
                    offset, limit, ids, status_ids, direction_ids, tag_ids, is_group
                )
                m = Activity2DBMapper()
                return process_items_from_db(
                    activities, ACTIVITIES_NOT_FOUND, m, offset=offset
                )
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e

    async def get_my_activities(self, id: int):
        async with self.__uow:
            try:
                activities = await self.__uow.activities.get_all(creater_id=id)
                m = ActivityDBMapper()
                return process_items_from_db(activities, ACTIVITIES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e

    async def post_avatar(self, file: UploadFile, activity_id: int, token: str):
        async with self.__uow:
            try:
                db_map = AvatarDBMapper()
                activity_db = await self.__uow.activities.get_by_id(activity_id)
                ava_id = db_map.mapping(activity_db.img).id

                res = await self.__file_service.post_file(file, token)
                activity_db.img = AvatarInputMapper().mapping(res)

                await self.__uow.activities.update(activity_db)
                await self.__uow.commit()
                return db_map.mapping(activity_db.img), ava_id
            except GetItemByIdException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e

    async def post_cover(self, file: UploadFile, activity_id: int, token: str):
        async with self.__uow:
            try:
                db_map = DecorationDBMapper()
                activity_db = await self.__uow.activities.get_by_id(activity_id)
                decoration_id = db_map.mapping(activity_db.decoration).id

                res = await self.__file_service.post_file(file, token)
                activity_db.decoration = DecorationInputMapper().mapping(res)

                await self.__uow.activities.update(activity_db)
                await self.__uow.commit()
                return db_map.mapping(activity_db.decoration), decoration_id
            except GetItemByIdException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e

    async def get_one(self, id: int):
        async with self.__uow:
            try:
                activity = await self.__uow.activities.get_by_id(id)
                return process_item_from_db(
                    activity, ACTIVITY_NOT_FOUND, FullActivityDBMapper()
                )
            except GetOneItemException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e

    async def update_activity(self, data: ActivityUpdateSchema):
        async with self.__uow:
            try:
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)
                activity_db = ActivityUpdInputMapper().mapping(data, activity_db)
                await self.__uow.groups.update(activity_db)
                await self.__uow.commit()
            except GetItemByIdException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_STATUS_ID_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPDATE_ACTIVITY_EXCEPTION) from e

            try:
                if data.delete_contacts:
                    for contact_link_id in data.delete_contacts:
                        await self.__uow.contact_activities.delete(id=contact_link_id)

                if data.add_contacts:
                    contact_m = ContactActivityInputMapper()
                    for contact_link in data.add_contacts:
                        contact_db = contact_m.mapping(contact_link, activity_db.id)
                        await self.__uow.contact_activities.add(contact_db)

                await self.__uow.commit()
                return MessageSchema(message=UPDATE_ACTIVITY_SUCCESS)
            except ForeignKeyViolationException as e:
                raise BadRequestException(TYPE_CONTACT_NO_EXIST) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_CONTACT_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_CONTACT_EXCEPTION) from e

    async def delete_activity(self, id: int):
        async with self.__uow:
            try:
                activity_db = await self.__uow.groups.get_by_id(id)
                ava_id = AvatarDBMapper().mapping(activity_db.avatar).id
                decoration_id = DecorationDBMapper().mapping(activity_db.decoration).id

                res = await self.__uow.activities.delete(id=id)
                if not res:
                    raise BadRequestException(ACTIVITY_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=DELETE_ACTIVITY), ava_id, decoration_id
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_ACTIVITY_EXCEPTION) from e

    async def create_invitation(self, data: ActivityGroupSchema):
        async with self.__uow:
            try:
                link = ActivityRequestInputMapper().mapping(data)
                await self.__uow.activity_requests.add(link)
                await self.__uow.commit()
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)
                return (
                    MessageSchema(message=INVATION_SUCCEESS),
                    group_db.name,
                    group_db.creater_id,
                    activity_db.name,
                )
            except UniqueViolationException as e:
                raise BadRequestException(INVATION_EXIST) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(GROUP_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(INVATION_EXCEPTION) from e

    async def create_request(self, data: ActivityGroupSchema):
        async with self.__uow:
            try:
                link = ActivityRequestInputMapper().mapping(data, ACT_REQ_REQ)
                await self.__uow.activity_requests.add(link)
                await self.__uow.commit()
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)
                group_db = await self.__uow.groups.get_by_id(data.group_id)

                return (
                    MessageSchema(message=REQUEST_SUCCEESS),
                    group_db.name,
                    activity_db.creater_id,
                    activity_db.name,
                )
            except UniqueViolationException as e:
                raise BadRequestException(INVATION_EXIST) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ACTIVITY_NOT_FOUND) from e
            except AddItemException as e:
                raise AnyServiceException(REQUEST_EXCEPTION) from e

    async def delete_invitation(self, group_id: int, activity_id: int, is_req):
        async with self.__uow:
            try:
                await self.__uow.activity_requests.delete(
                    group_id=group_id, activity_id=activity_id
                )
                await self.__uow.commit()
                m = DELETE_REQ_SUCCESS if is_req else DELETE_INV_SUCCESS
                return MessageSchema(message=m)
            except DeleteItemException as e:
                m = DELETE_REQ_EXCEPTION if is_req else DELETE_INV_EXCEPTION
                raise AnyServiceException(m) from e

    async def reject_invitation(self, data: ActivityGroupSchema, is_req: bool):
        async with self.__uow:
            try:
                link_db = await self.__uow.activity_requests.get_one(
                    group_id=data.group_id, activity_id=data.activity_id
                )
                link_db.status_id = ACT_REQ_
                await self.__uow.activities.update(link_db)
                await self.__uow.commit()
                m = REQ__SUCCESS if is_req else INV__SUCCESS
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                return (
                    MessageSchema(message=m),
                    activity_db.name,
                    group_db.creater_id,
                    activity_db.creater_id,
                )
            except GetOneItemException as e:
                raise AnyServiceException(REQ_EXCEPTION) from e
            except UpdateItemException as e:
                m = REQ__EXCEPTION if is_req else INV__EXCEPTION
                raise AnyServiceException(m) from e

    async def approve_invitation(self, data: ActivityGroupSchema, is_req: bool):
        async with self.__uow:
            try:
                links = await self.__uow.activity_requests.get_all(
                    activity_id=data.activity_id
                )
                for l in links:
                    l.status_id = ACT_REQ_INVALID
                    await self.__uow.activity_requests.update(l)

                link_db = await self.__uow.activity_requests.get_one(
                    group_id=data.group_id, activity_id=data.activity_id
                )
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)

                link_db.status_id = ACT_REQT
                activity_db.group_id = data.group_id

                await self.__uow.activity_requests.update(link_db)
                await self.__uow.activities.update(activity_db)
                await self.__uow.commit()
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                m = REQT_SUCCESS if is_req else INVT_SUCCESS
                return (
                    MessageSchema(message=m),
                    activity_db.name,
                    group_db.creater_id,
                    activity_db.creater_id,
                )
            except GetAllItemsException as e:
                raise AnyServiceException(REQS_EXCEPTION) from e
            except GetItemByIdException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e
            except GetOneItemException as e:
                raise AnyServiceException(REQ_EXCEPTION) from e
            except UpdateItemException as e:
                m = REQT_EXCEPTION if is_req else INVT_EXCEPTION
                raise AnyServiceException(m) from e

    async def exit_to_activity(self, data: ActivityGroupSchema, is_kick: bool):
        async with self.__uow:
            try:
                activity_db = await self.__uow.activities.get_by_id(data.activity_id)
                group_db = await self.__uow.groups.get_by_id(data.group_id)
                if not activity_db:
                    raise BadRequestException(ACTIVITY_NOT_FOUND) from None

                activity_db.group_id = None
                await self.__uow.activities.update(activity_db)
                await self.__uow.commit()

                m = KICK_SUCCESS if is_kick else EXIT_SUCCESS
                return (
                    MessageSchema(message=m),
                    activity_db.name,
                    activity_db.creater_id,
                    group_db.name,
                    group_db.creater_id,
                )
            except GetItemByIdException as e:
                raise AnyServiceException(ACTIVITY_EXCEPTION) from e
            except UpdateItemException as e:
                m = KICK_EXCEPTION if is_kick else EXIT_EXCEPTION
                raise AnyServiceException(m) from e

    async def create_task(self, data: CreateTaskSchema, id: int):
        async with self.__uow:
            try:
                task_db = ActivityTaskInputMapper().mapping(data, id)
                task_db = await self.__uow.activity_tasks.add(task_db)
                await self.__uow.commit()
                return MessageSchema(message=TASK_ADDED)
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_STATUS_ID_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(ADD_TASK_FAILED) from e

    async def update_task(self, data: UpdateTaskSchema):
        async with self.__uow:
            try:
                task_db = await self.__uow.activity_tasks.get_by_id(data.task_id)
                task_db = ActivityTaskUpdInputMapper().mapping(data, task_db)
                arr_files = task_db.materials.get("files", [])
                arr_imgs = task_db.materials.get("images", [])
                task_db.materials = {}
                await self.__uow.activity_tasks.update(task_db)
                await self.__uow.commit()
            except GetItemByIdException as e:
                raise AnyServiceException(TASK_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_STATUS_ID_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPDATE_TASK_EXCEPTION) from e

            try:

                am = FileInputMapper()

                if data.delete_ids:
                    arr_files = [i for i in arr_files if i["id"] not in data.delete_ids]
                    arr_imgs = [i for i in arr_imgs if i["id"] not in data.delete_ids]

                for file in data.files:
                    f = am.mapping(file)
                    abr = file.name.split(".")[-1]

                    if abr and abr in IMAGES:
                        arr_imgs.append(f)
                    else:
                        arr_files.append(f)

                task_db.materials = {"files": arr_files, "images": arr_imgs}
                await self.__uow.activity_tasks.update(task_db)
                await self.__uow.commit()
                return MessageSchema(message=TASK_UPDATED)
            except AddItemException as e:
                raise AnyServiceException(UPDATE_TASK_EXCEPTION) from e

    async def delete_task(self, id: int):
        async with self.__uow:
            try:
                task_db = await self.__uow.activity_tasks.get_by_id(id)
                arr_files = task_db.materials.get("files", [])
                arr_imgs = task_db.materials.get("images", [])
                arr = [i["id"] for i in arr_files]
                arr.extend([i["id"] for i in arr_imgs])

                res = await self.__uow.activity_tasks.delete(id=id)
                if not res:
                    raise BadRequestException(TASK_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=DELETE_TASK), arr
            except GetItemByIdException as e:
                raise AnyServiceException(TASK_EXCEPTION) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_TASK_EXCEPTION) from e

    async def assign_task(self, data: AssignTaskSchema):
        async with self.__uow:
            try:
                ass_id = ActivityTaskUserInputMapper().mapping(data)
                ass_id = await self.__uow.activity_task_assignments.add(ass_id)
                await self.__uow.commit()
                task_db = await self.__uow.activity_tasks.get_by_id(data.task_id)
                activity_db = await self.__uow.activities.get_by_id(task_db.activity_id)
                return MessageSchema(message=TASK_ADDED), task_db.name, activity_db.name
            except UniqueViolationException as e:
                raise BadRequestException(TASK_ASSIGNED_ALREADY) from e
            except AddItemException as e:
                raise AnyServiceException(ASS_EXCEPTION) from e

    async def delete_assign_task(self, task_id: int, user_id: int):
        async with self.__uow:
            try:

                res = await self.__uow.activity_task_assignments.delete(
                    task_id=task_id, user_id=user_id
                )
                if not res:
                    raise BadRequestException(ASS_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=ASS_DELETED)
            except DeleteItemException as e:
                raise AnyServiceException(ASS_DELETED_EXCEPTION) from e

    async def change_task_status(self, data: ChangeTaskStatus):
        async with self.__uow:
            try:
                task_db = await self.__uow.activity_tasks.get_by_id(data.task_id)
                task_db.status_id = data.status_id
                await self.__uow.activity_tasks.update(task_db)
                await self.__uow.commit()
                return MessageSchema(message=TASK_STATUS_UPDATED)
            except GetItemByIdException as e:
                raise AnyServiceException(TASK_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ADD_STATUS_ID_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(UPDATE_TASK_STATUS_EXCEPTION) from e

    async def get_all_task_status(self):
        async with self.__uow:
            try:
                statuses = await self.__uow.activity_tasks_statuses.get_all()
                m = ATStatusDBMapper()
                return process_items_from_db(statuses, ASTATUSES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(ASTATUSES_EXCEPTION) from e

    async def get_tasks(self, activity_id: int, res: ResultCheck):
        async with self.__uow:
            try:
                tasks = await self.__uow.activity_tasks.get_all(activity_id=activity_id)
                tasks = list(filter(lambda t: self.__check_task(t, res), tasks))
                m = ATaskDBMapper()
                return process_items_from_db(tasks, TASKS_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(TASKS_EXCEPTION) from e

    def __check_task(self, t: ActivityTask, res: ResultCheck):
        role_group = res.resource.details.get("role_group", False)
        if role_group:
            role_group = role_group in [ROLE_ID_GR_CREATER, ROLE_ID_GROUP_ADMIN]
        owner = res.resource.owner_id == res.subject.id
        assign = False
        if res.resource.details.get("is_assign", False):
            assign = t.id in res.resource.details["ass_id"]
        return role_group or owner or assign

    def __search_activity(self, substr: str):
        res = TypesenseCon.collections[NAME_SCHEMA_ACTIVITY].documents.search(
            {
                "q": substr,
                "query_by": "name,description,direction,tags,embedding",
                "exclude_fields": "embedding",
            }
        )
        return [
            h["document"]["activity_id"]
            for h in res["hits"]
            if h["hybrid_search_info"]["rank_fusion_score"] > RANK_FUSION_SCORE
        ]
