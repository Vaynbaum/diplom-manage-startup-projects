from abc import ABC, abstractmethod
from vakt import Inquiry

from src.authorization.config import ABACGuard
from src.authorization.schemas import *

# from src.store.const import RESOURCE_PRODUCT
from src.user.const import RESOURCE_PROFILE


class BasePicker(ABC):
    @abstractmethod
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        raise NotImplementedError()

    def _subject_build_role(self, subject: SubjectData):
        return {"role": subject.role_id}

    def _resource_build_name(self, resource: ResourceData):
        return {"name": resource.name}

    def _build_inq_and_execute(self, action, resource, subject):
        inq = Inquiry(action=action, resource=resource, subject=subject)
        return StatusAccess.allow if ABACGuard.is_allowed(inq) else StatusAccess.denied


class RolePicker(BasePicker):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class RoleOwnerPicker(BasePicker):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        if not (subject and subject.id and resource and resource.owner_id):
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["is_owner"] = subject.id == resource.owner_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class ProfileWithoutIDPicker(BasePicker):
    def check(
        self, action: ActionData, resource: ResourceRoleData, subject: SubjectData
    ):
        if not (
            resource.name == RESOURCE_PROFILE
            and not resource.id
            and not resource.owner_id
            and subject
            and subject.id
        ):
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["is_owner"] = True
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class ResourceWithRolePicker(BasePicker):
    def check(
        self, action: ActionData, resource: ResourceRoleData, subject: SubjectData
    ):
        if type(resource) != ResourceRoleData:
            return StatusAccess.denied

        subject_to_inq = self._subject_build_role(subject)
        resource_to_inq = self._resource_build_name(resource)
        resource_to_inq["role"] = resource.role_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class GroupUserPicker(BasePicker):
    def check(
        self, action: ActionData, resource: ResourceRoleData, subject: SubjectData
    ):
        sd = subject.details
        if not sd:
            return StatusAccess.denied
        role_id = sd.get("role_group", None)
        if not role_id:
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["role_group"] = role_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class RoleGroupUserAssignPicker(BasePicker):
    def check(
        self, action: ActionData, resource: ResourceRoleData, subject: SubjectData
    ):
        sd = subject.details
        rd = resource.details
        if not sd or not rd:
            return StatusAccess.denied

        role_id = sd.get("role_group", None)
        assign_role_id = rd.get("role_group", None)
        role_user = rd.get("role_user", None)
        if not role_id:
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["role_group"] = role_id
        if assign_role_id:
            resource_to_inq["role_group"] = assign_role_id
        resource_to_inq["role_user"] = role_user
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class GroupUserActivityPicker(BasePicker):
    def check(
        self, action: ActionData, resource: ResourceRoleData, subject: SubjectData
    ):
        sd = subject.details
        rd = resource.details
        if not sd or not rd:
            return StatusAccess.denied

        role_id = sd.get("role_group", None)
        status_id = rd.get("status", None)
        if not role_id or not status_id:
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["role_group"] = role_id
        resource_to_inq["status"] = status_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class RoleOwnerActivityPicker(BasePicker):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        if not (subject and subject.id and resource and resource.owner_id):
            return StatusAccess.denied

        rd = resource.details
        if not rd:
            return StatusAccess.denied

        status_id = rd.get("status", None)
        if not status_id:
            return StatusAccess.denied

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        subject_to_inq["is_owner"] = subject.id == resource.owner_id
        resource_to_inq["status"] = status_id
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class RoleOwnerActivityUserPicker(BasePicker):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):

        sd = subject.details
        rd = resource.details
        if not sd and not rd:
            return StatusAccess.denied

        assign_role_id = rd.get("role_group", None) if rd else None
        user_id = rd.get("user_id", None) if rd else None
        role_id = sd.get("role_group", None) if sd else None

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)

        if role_id:
            subject_to_inq["role_group"] = role_id
        if subject and subject.id and resource and resource.owner_id:
            subject_to_inq["is_owner"] = subject.id == resource.owner_id

        if assign_role_id:
            resource_to_inq["role_group"] = assign_role_id
        if user_id and resource.owner_id:
            resource_to_inq["is_owner"] = user_id == resource.owner_id

        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)


class RoleOwnerActivityUserStatusPicker(BasePicker):
    def check(self, action: ActionData, resource: ResourceData, subject: SubjectData):
        rd = resource.details
        if not rd:
            return StatusAccess.denied
        role_id = rd.get("role_group", None)
        assign = rd.get("is_assign", False)

        resource_to_inq = self._resource_build_name(resource)
        subject_to_inq = self._subject_build_role(subject)
        if resource.owner_id:
            subject_to_inq["is_owner"] = subject.id == resource.owner_id
        if role_id:
            subject_to_inq["role_group"] = role_id
        if assign:
            subject_to_inq["is_assign"] = assign
            
        return self._build_inq_and_execute(action.name, resource_to_inq, subject_to_inq)
