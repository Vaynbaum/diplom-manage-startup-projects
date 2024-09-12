from fastapi import Depends

from src.admin.service import AdminService
from src.common.depends import create_uow
from src.common.services.unit_of_work import IUnitOfWork


def create_admin_service(uow: IUnitOfWork = Depends(create_uow)):
    return AdminService(uow)
