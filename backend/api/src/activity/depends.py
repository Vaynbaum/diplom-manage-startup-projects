from fastapi import Depends

from src.authorization.depends import FactoryAuthorizationService
from src.file.depends import create_file_service
from src.file.service import FileService
from src.activity.informants import *
from src.activity.service import ActivityService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import *
from src.group.depends import create_group_user_informant
from src.tag.depends import create_res_activity_informant


def create_activity_service(
    uow: IUnitOfWork = Depends(create_uow),
    file_service: FileService = Depends(create_file_service),
):
    return ActivityService(uow, file_service)


def create_activity_group_informant():
    return ActivityGroupInformant()


def create_activity_group_activity_informant():
    return ActivityGroupAndActivityInformant()


def create_activity_group_link_informant():
    return ResActivityGroupLinkInformant()


def create_task_activity_group_link_informant():
    return ResTaskActivityGroupLinkInformant()


def create_task_activity_informant():
    return ResTaskActivityInformant()


def create_task_user_activity_informant():
    return ResTaskUserActivityInformant()


def create_task_activity_group_link_status_informant():
    return ResTaskActivityGroupLinkStatusInformant()


def create_task_activity_get_informant():
    return ResTaskActivityGetInformant()


factory_res_group_link_auth = FactoryAuthorizationService(
    resource_informant=create_activity_group_informant(),
    subject_informant=create_group_user_informant(),
)
factory_res_activity_link_auth = FactoryAuthorizationService(
    resource_informant=create_activity_group_activity_informant()
)
factory_res_activity_group_link_auth = FactoryAuthorizationService(
    resource_informant=create_res_activity_informant(),
    subject_informant=create_activity_group_link_informant(),
)
factory_res_task_activity_group_link_auth = FactoryAuthorizationService(
    resource_informant=create_task_activity_informant(),
    subject_informant=create_task_activity_group_link_informant(),
)
factory_res_task_user_activity_group_link_auth = FactoryAuthorizationService(
    resource_informant=create_task_user_activity_informant(),
    subject_informant=create_task_activity_group_link_informant(),
)
factory_res_task_user_activity_group_link_status_auth = FactoryAuthorizationService(
    resource_informant=create_task_activity_group_link_status_informant()
)
factory_res_task_activity_get_auth = FactoryAuthorizationService(
    resource_informant=create_task_activity_get_informant()
)
