from src.common.exceptions import AnyServiceException, BadRequestException
from src.common.schemas import MessageSchema
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import add_ids, add_names, process_items_from_db
from src.database.exceptions import (
    AddItemException,
    DeleteItemException,
    ForeignKeyViolationException,
    GetAllItemsException,
    GetItemByIdException,
    GetOneItemException,
    UpdateItemException,
)
from src.group.phrases import *
from src.portfolio.mappers import *
from src.portfolio.phrases import *
from src.portfolio.schemas.portfolio_create import PortfolioCreateSchema
from src.post.phrases import TAG_GET_EXCEPTION, TAG_NO_EXIST
from src.tag.mappers import TagInputMapper


class PortfolioService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_types(self):
        async with self.__uow:
            try:
                types = await self.__uow.portfolio_types.get_all()
                m = PTypeDBMapper()
                return process_items_from_db(types, GTYPES_NOT_FOUND, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(GTYPES_EXCEPTION) from e

    async def create_portfolio(self, portfolio: PortfolioCreateSchema, id: int):
        async with self.__uow:
            try:
                portfolio_db = PortfolioInputMapper().mapping(portfolio, id)
                portfolio_db = await self.__uow.portfolios.add(portfolio_db)
                await self.__uow.commit()
                portfolio_db = await self.__uow.portfolios.get_by_id(portfolio_db.id)

                m = PortfolioTagLinkInputMapper()
                tm = TagInputMapper()
                rep = self.__uow.tag_portfolios

                await add_ids(
                    self.__uow,
                    rep,
                    portfolio_db.id,
                    portfolio.tag_ids,
                    m,
                    portfolio_id=portfolio_db.id,
                )
                await add_names(
                    self.__uow,
                    rep,
                    portfolio_db.id,
                    portfolio.tag_names,
                    m,
                    tm,
                    portfolio_id=portfolio_db.id,
                )
                id = portfolio_db.id

            except ForeignKeyViolationException as e:
                raise BadRequestException(TAG_NO_EXIST)
            except AddItemException as e:
                raise AnyServiceException(ADD_PORTFOLIO_FAILED) from e

        async with self.__uow:
            try:
                new_portfolio_db = await self.__uow.portfolios.get_by_id(id)
                return PortfolioDBMapper().mapping(new_portfolio_db)
            except GetItemByIdException as e:
                raise AnyServiceException(PORTFOLIO_GET_EXCEPTION) from e

    async def update_portfolio(self, portfolio: PortfolioUpdateSchema):
        async with self.__uow:
            try:
                portfolio_db = await self.__uow.portfolios.get_by_id(portfolio.id)
                portfolio_db = PortfolioUpdInputMapper().mapping(
                    portfolio, portfolio_db
                )
                await self.__uow.portfolios.update(portfolio_db)
                await self.__uow.commit()
            except GetItemByIdException as e:
                raise AnyServiceException(PORTFOLIO_GET_EXCEPTION) from e
            except UpdateItemException as e:
                raise AnyServiceException(PORTFOLIO_UPD_EXCEPTION) from e

            try:
                for id in portfolio.delete_tag_ids:
                    await self.__uow.tag_portfolios.delete(
                        portfolio_id=portfolio_db.id, tag_id=id
                    )
                await self.__uow.commit()

                m = PortfolioTagLinkInputMapper()
                tm = TagInputMapper()
                rep = self.__uow.tag_portfolios

                await add_ids(
                    self.__uow,
                    rep,
                    portfolio_db.id,
                    portfolio.tag_ids,
                    m,
                    portfolio_id=portfolio_db.id,
                )
                await add_names(
                    self.__uow,
                    rep,
                    portfolio_db.id,
                    portfolio.tag_names,
                    m,
                    tm,
                    portfolio_id=portfolio_db.id,
                )
            except GetOneItemException as e:
                raise AnyServiceException(TAG_GET_EXCEPTION) from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(TAG_NO_EXIST)
            except UpdateItemException as e:
                raise AnyServiceException(PORTFOLIO_UPD_EXCEPTION) from e
            except AddItemException as e:
                raise AnyServiceException(PORTFOLIO_UPD_EXCEPTION) from e

        async with self.__uow:
            try:
                new_portfolio_db = await self.__uow.portfolios.get_by_id(portfolio.id)
                return PortfolioDBMapper().mapping(new_portfolio_db)
            except GetItemByIdException as e:
                raise AnyServiceException(PORTFOLIO_GET_EXCEPTION) from e

    async def delete_portfolio(self, id: int):
        async with self.__uow:
            try:
                portfolio_db = await self.__uow.portfolios.get_by_id(id)
                
                file_id = None
                file = portfolio_db.material.get("file", None)
                if file:
                    file_id = file["id"]
                img = portfolio_db.material.get("img", None)
                if img:
                    file_id = img["id"]
                res = await self.__uow.portfolios.delete(id=id)
                
                if not res:
                    raise BadRequestException(PORTFOLIO_NOT_FOUND) from None
                await self.__uow.commit()
                return MessageSchema(message=DELETE_PORTFOLIO), file_id
            except GetItemByIdException as e:
                raise AnyServiceException(PORTFOLIO_GET_EXCEPTION) from e
            except DeleteItemException as e:
                raise AnyServiceException(DELETE_PORTFOLIO_EXCEPTION) from e
