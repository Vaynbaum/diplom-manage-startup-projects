from src.authorization.informants import IResourceInformant
from src.authorization.schemas import *
from src.common.exceptions import AnyServiceException
from src.database.exceptions import GetItemByIdException
from src.common.services.unit_of_work import IUnitOfWork
from src.file.exceptions import FileNotFoundException
from src.file.phrases import FILE_GET_FAILED


class FileInformant(IResourceInformant):
    async def get(self, resource: dict, uow: IUnitOfWork) -> ResourceData:
        try:
            id = resource.get("id", None)
            data = ResourceData(**resource)

            file = await uow.files.get_by_id(id)
            if file is None:
                raise FileNotFoundException() from None
            data.owner_id = file.owner_id
            return data
        except GetItemByIdException as e:
            raise AnyServiceException(FILE_GET_FAILED) from e
