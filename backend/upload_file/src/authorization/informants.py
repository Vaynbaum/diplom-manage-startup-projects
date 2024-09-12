from abc import ABC, abstractmethod

from src.authorization.schemas import *
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import TokenDataSchema


class ISubjectInformant(ABC):
    @abstractmethod
    async def get(self, token_data: TokenDataSchema) -> SubjectData:
        raise NotImplementedError()


class IActionInformant(ABC):
    @abstractmethod
    async def get(self, name: str) -> ActionData:
        raise NotImplementedError()


class IResourceInformant(ABC):
    @abstractmethod
    async def get(self, resource: dict, uow: IUnitOfWork) -> ResourceData:
        raise NotImplementedError()


class AbstractUserInformant(ISubjectInformant):
    async def get(self, token_data: TokenDataSchema) -> SubjectData:
        # return await uow.user_abstracts.get_by_id(id)
        return SubjectData(**token_data.dict())


class ActionInformant(IActionInformant):
    async def get(self, name: str) -> ActionData:
        return ActionData(name=name)


class DefaultResourceInformant(IResourceInformant):
    async def get(self, resource: dict, _: IUnitOfWork) -> ResourceData:
        return ResourceData(**resource)
