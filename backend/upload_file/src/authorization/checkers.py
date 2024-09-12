from abc import ABC, abstractmethod
from vakt import Inquiry

from src.authorization.config import ABACGuard
from src.authorization.schemas import *

# from src.store.const import RESOURCE_PRODUCT
# from src.user.const import RESOURCE_PROFILE


def subject_build_role(subject: SubjectData):
    return {"role": subject.role_id}


def resource_build_name(resource: ResourceData):
    return {"name": resource.name}


class BaseCheckerAuthService(ABC):
    @abstractmethod
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        raise NotImplementedError()

    def _build_inq_and_execute(self, action, resource, subject):
        inq = Inquiry(action=action, resource=resource, subject=subject)
        return StatusAccess.allow if ABACGuard.is_allowed(inq) else StatusAccess.denied


class RoleCheckerAuthService(BaseCheckerAuthService):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        subject_to_inq = subject_build_role(subject)
        return self._build_inq_and_execute(action.name, resource.name, subject_to_inq)


class RoleOwnerCheckerAuthService(BaseCheckerAuthService):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        if not (subject and subject.id and resource and resource.owner_id):
            return StatusAccess.denied

        subject_to_inq = subject_build_role(subject)
        resource_to_inq = resource_build_name(resource)
        resource_to_inq["is_owner"] = subject.id == resource.owner_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


# class ProductCheckerAuthService(BaseCheckerAuthService):
#     def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
#         subject_to_inq = subject_build_role(subject)
#         resource_to_inq = resource_build_name(resource)
#         if resource.name == RESOURCE_PRODUCT:
#             resource_to_inq["is_owner"] = subject.id == resource.owner_id
#         return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)
