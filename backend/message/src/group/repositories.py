from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import or_

from src.database.repositories.simple import *
from src.database.models import *
from src.database.repositories import *


class IGroupUserRepository(GenericRepository[GroupUser], ABC):
    pass


class GroupUserRepository(GenericSqlRepository[GroupUser], IGroupUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, GroupUser)
