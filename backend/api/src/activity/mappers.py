from src.activity.consts import *
from src.activity.schemas import *
from src.database.models import *
from src.common.mappers import *
from src.user.mappers import FileInputMapper


class ActivityUpdInputMapper(BaseMapper[ActivityUpdateSchema, Activity]):
    def mapping(self, data: ActivityCreateSchema, activity_db: Activity):
        if data.name and activity_db.name != data.name:
            activity_db.name = data.name
        if data.description and activity_db.description != data.description:
            activity_db.description = data.description
        if data.status_id and activity_db.status_id != data.status_id:
            activity_db.status_id = data.status_id
        if data.direction_id and activity_db.direction_id != data.direction_id:
            activity_db.direction_id = data.direction_id
        return activity_db


class ContactActivityInputMapper(BaseMapper[ContactAddSchema, ContactActivity]):
    def mapping(self, link: ContactAddSchema, activity_id: int):
        return ContactActivity(
            activity_id=activity_id, value=link.value, contact_id=link.contact_id
        )


class ActivityInputMapper(BaseMapper[ActivityCreateSchema, Activity]):
    def mapping(self, activity: ActivityCreateSchema, creater_id: int):
        return Activity(
            name=activity.name,
            description=activity.description,
            status_id=activity.status_id,
            direction_id=activity.direction_id,
            creater_id=creater_id,
            decoration={},
            img={},
            fields={},
        )


class ActivityRequestInputMapper(BaseMapper[ActivityGroupSchema, ActivityRequest]):
    def mapping(self, activity: ActivityGroupSchema, status_id=ACT_REQ_INV):
        return ActivityRequest(
            group_id=activity.group_id,
            activity_id=activity.activity_id,
            status_id=status_id,
        )


class ActivityDBMapper(SimpleDBMapper[Activity, ActivityDBSchema]):
    def __init__(self):
        super().__init__(ActivityDBSchema)


class Activity2DBMapper(SimpleDBMapper[Activity, ActivitySchema]):
    def __init__(self):
        super().__init__(ActivitySchema)


class AStatusDBMapper(SimpleDBMapper[ActivityStatus, ActivityStatusSchema]):
    def __init__(self):
        super().__init__(ActivityStatusSchema)


class DirectionDBMapper(SimpleDBMapper[Direction, DirectionSchema]):
    def __init__(self):
        super().__init__(DirectionSchema)


class ATStatusDBMapper(SimpleDBMapper[ActivityTaskStatus, ActivityTaskStatusShema]):
    def __init__(self):
        super().__init__(ActivityTaskStatusShema)


class ATaskDBMapper(BaseMapper[ActivityTask, ActivityTaskUsersShema]):
    def mapping(self, activity: Activity):
        a = ActivityTaskUsersShema.from_orm(activity)
        for link in a.users:
            link.user = link.user.user_abstract
        return a


class FullActivityDBMapper(BaseMapper[Activity, FullActivitySchema]):
    def mapping(self, activity: Activity):
        a = FullActivitySchema.from_orm(activity)
        a.creater = a.creater.user_abstract
        if a.group:
            for u in a.group.users:
                u.user = u.user.user_abstract
        return a


class ActivityTaskUserInputMapper(BaseMapper[AssignTaskSchema, ActivityTaskAssignment]):
    def mapping(self, data: AssignTaskSchema):
        return ActivityTaskAssignment(task_id=data.task_id, user_id=data.user_id)


class ActivityTaskInputMapper(BaseMapper[CreateTaskSchema, ActivityTask]):
    def mapping(self, activity: CreateTaskSchema, id: int):
        arr_imgs = []
        arr_files = []
        am = FileInputMapper()
        for file in activity.files:
            f = am.mapping(file)
            abr = file.name.split(".")[-1]

            if abr and abr in IMAGES:
                arr_imgs.append(f)
            else:
                arr_files.append(f)

        a = ActivityTask(
            name=activity.name,
            description=activity.description,
            deadline=activity.deadline,
            activity_id=activity.activity_id,
            status_id=activity.status_id,
            creater_id=id,
            materials={"files": arr_files, "images": arr_imgs},
        )
        return a


class ActivityTaskUpdInputMapper(BaseMapper[UpdateTaskSchema, ActivityTask]):
    def mapping(self, data: UpdateTaskSchema, task_db: ActivityTask):
        if data.name and task_db.name != data.name:
            task_db.name = data.name
        if data.description and task_db.description != data.description:
            task_db.description = data.description
        if data.deadline and task_db.deadline != data.deadline:
            task_db.deadline = data.deadline
        return task_db
