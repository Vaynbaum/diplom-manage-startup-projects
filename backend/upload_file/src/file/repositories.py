from abc import ABC
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.models import *
from src.database.repositories import GenericSqlRepository, GenericRepository


class IFileRepository(GenericRepository[FileModel], ABC):
    pass


class FileRepository(GenericSqlRepository[FileModel], IFileRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, FileModel)
