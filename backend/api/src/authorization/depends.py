from fastapi import Depends

from src.authorization.pickers import *
from src.authorization.service import AuthorizationService
from src.authorization.informants import *
from src.token.depends import create_token_service
from src.token.service import TokenService
from src.common.services.unit_of_work import IUnitOfWork
from src.common.depends import create_uow


def create_default_action_resource_informant():
    return ActionInformant()


def create_default_subject_resource_informant():
    return AbstractUserInformant()


PICKERS = [
    RolePicker(),
    RoleOwnerPicker(),
    ProfileWithoutIDPicker(),
    ResourceWithRolePicker(),
    GroupUserPicker(),
    RoleGroupUserAssignPicker(),
    GroupUserActivityPicker(),
    RoleOwnerActivityPicker(),
    RoleOwnerActivityUserPicker(),
    RoleOwnerActivityUserStatusPicker()
]


class FactoryAuthorizationService:
    def __init__(
        self,
        resource_informant: IResourceInformant = DefaultResourceInformant(),
        subject_informant: ISubjectInformant | None = None,
        action_informant: IActionInformant | None = None,
    ):
        """Конструктор фабрики сервисов авторизации

        Args:
            resource_informant (IResourceInformant, optional): Чаще всего надо создавать класс
            и передавать экзмпляр информатора. Defaults to DefaultResourceInformant().
        """
        self.resource_informant = resource_informant
        self.subject_informant = subject_informant
        self.action_informant = action_informant

    def __call__(
        self,
        uow: IUnitOfWork = Depends(create_uow),
        action_informant: IActionInformant = Depends(
            create_default_action_resource_informant
        ),
        subject_informant: ISubjectInformant = Depends(
            create_default_subject_resource_informant
        ),
        token_service: TokenService = Depends(create_token_service),
    ):
        return AuthorizationService(
            uow,
            PICKERS,
            token_service,
            self.resource_informant,
            self.subject_informant if self.subject_informant else subject_informant,
            self.action_informant if self.action_informant else action_informant,
        )


factory_default_auth = FactoryAuthorizationService()
