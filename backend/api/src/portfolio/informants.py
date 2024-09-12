
from src.authorization.informants import IResourceInformant
from src.authorization.schemas import ResourceData, ResourceRoleData
from src.common.services.unit_of_work import IUnitOfWork
from src.token.schemas import InpDataInform


class PortfolioOwnerInformant(IResourceInformant):
    async def get(self, inp_data: InpDataInform, uow: IUnitOfWork) -> ResourceData:
        r = inp_data.resource
        data = ResourceRoleData(**r)
        portfolio_id = inp_data.resource.get("portfolio_id", None)

        if portfolio_id:
            portfolio = await uow.portfolios.get_by_id(portfolio_id)
            if portfolio:
                if portfolio.group:
                    data.owner_id = portfolio.group.creater_id
                elif portfolio.activity:
                    data.owner_id = portfolio.activity.creater_id
                else:
                    data.owner_id = portfolio.user_id

        return data