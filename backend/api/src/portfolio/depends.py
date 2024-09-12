from fastapi import Depends

from src.authorization.depends import FactoryAuthorizationService
from src.common.depends import create_uow
from src.common.services.unit_of_work import IUnitOfWork
from src.portfolio.informants import PortfolioOwnerInformant
from src.portfolio.service import PortfolioService


def create_portfolio_service(uow: IUnitOfWork = Depends(create_uow)):
    return PortfolioService(uow)


def create_portfolio_owner_informant():
    return PortfolioOwnerInformant()


factory_res_portfolio_owner_auth = FactoryAuthorizationService(
    resource_informant=create_portfolio_owner_informant()
)
