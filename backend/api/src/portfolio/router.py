from typing import List
from fastapi import APIRouter, Depends, Query

from src.authorization.service import AuthorizationService
from src.background_tasks.file import delete_file
from src.config import OAuth2Scheme
from src.portfolio.consts import *
from src.authorization.depends import *
from src.portfolio.depends import *
from src.portfolio.schemas.portfolio_create import PortfolioCreateSchema
from src.post.depends import *
from src.portfolio.schemas import *
from src.common.consts import *
from src.portfolio.schemas import *
from src.portfolio.service import *

router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get(f"/types/{ALL}", response_model=List[PortfolioTypeSchema])
async def get_types(
    portfolio_service: PortfolioService = Depends(create_portfolio_service),
):
    return await portfolio_service.get_all_types()


@router.post("/", response_model=FullPortfolioSchema)
async def create_portfolio(
    portfolio: PortfolioCreateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_owner_auth),
    portfolio_service: PortfolioService = Depends(create_portfolio_service),
):
    kwargs = {"group_id": portfolio.group_id, "activity_id": portfolio.activity_id}
    res = await auth_service.check(METHOD_ADD, token, name=RES_PORTFOLIO, **kwargs)
    return await portfolio_service.create_portfolio(portfolio, res.subject.id)


@router.put("/", response_model=FullPortfolioSchema)
async def update_portfolio(
    portfolio: PortfolioUpdateSchema,
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_portfolio_owner_auth),
    portfolio_service: PortfolioService = Depends(create_portfolio_service),
):
    kwargs = {"portfolio_id": portfolio.id}
    res = await auth_service.check(METHOD_UPDATE, token, name=RES_PORTFOLIO, **kwargs)
    res = await portfolio_service.update_portfolio(portfolio)
    if portfolio.delete_file_id:
        delete_file.delay(portfolio.delete_file_id, token)
    return res


@router.delete("/", response_model=MessageSchema)
async def delete_portfolio(
    id: int = Query(gt=0),
    token: str = Depends(OAuth2Scheme),
    auth_service: AuthorizationService = Depends(factory_res_portfolio_owner_auth),
    portfolio_service: PortfolioService = Depends(create_portfolio_service),
):
    kwargs = {"portfolio_id": id}
    await auth_service.check(METHOD_DELETE, token, name=RES_PORTFOLIO, **kwargs)
    res, file_id = await portfolio_service.delete_portfolio(id)
    delete_file.delay(file_id, token)
    return res
