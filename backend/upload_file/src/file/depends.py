from fastapi import Depends


from src.authorization.depends import FactoryAuthorizationService
from src.common.depends import create_uow
from src.common.services.unit_of_work import IUnitOfWork
from src.file.informants import FileInformant
from src.file.service import FileService
from src.loader.base import BaseLoaderService
from src.loader.sber_cloud import SberCloudLoaderService


def sber_cloud_loader():
    return SberCloudLoaderService()


def create_file_service(
    uow: IUnitOfWork = Depends(create_uow),
    loader: BaseLoaderService = Depends(sber_cloud_loader),
):
    return FileService(uow, loader)


def create_file_informant():
    return FileInformant()


factory_res_file_auth = FactoryAuthorizationService(
    resource_informant=create_file_informant()
)
