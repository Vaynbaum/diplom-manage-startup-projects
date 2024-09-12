from abc import ABC, abstractmethod

from src.authorization.schemas import *
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform


class ISubjectInformant(ABC):
    @abstractmethod
    async def get(
        self, data: InpDataInform, uow: IUnitOfWork | None = None
    ) -> SubjectData:
        raise NotImplementedError()


class IActionInformant(ABC):
    @abstractmethod
    async def get(self, data: InpDataInform) -> ActionData:
        raise NotImplementedError()


class IResourceInformant(ABC):
    @abstractmethod
    async def get(self, data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        raise NotImplementedError()


class AbstractUserInformant(ISubjectInformant):
    async def get(
        self, data: InpDataInform, _: IUnitOfWork | None = None
    ) -> SubjectData:
        # return await uow.user_abstracts.get_by_id(id)
        return SubjectData(**data.token_data.dict())


class ActionInformant(IActionInformant):
    async def get(self, data: InpDataInform) -> ActionData:
        return ActionData(name=data.action)


class DefaultResourceInformant(IResourceInformant):
    async def get(self, data: InpDataInform, _: IUnitOfWork) -> ResourceData:
        return ResourceData(**data.resource)
