from src.activity.consts import IMAGES
from src.common.mappers import BaseMapper
from src.database.models.portfolio.portfolio_type import PortfolioType
from src.portfolio.schemas import *
from src.user.mappers import FileInputMapper


class PTypeDBMapper(BaseMapper[PortfolioType, PortfolioTypeSchema]):
    def mapping(self, type: PortfolioType):
        return PortfolioTypeSchema.from_orm(type)


class PortfolioInputMapper(BaseMapper[PortfolioCreateSchema, Portfolio]):
    def mapping(self, data: PortfolioCreateSchema, id: int):
        p = Portfolio(
            name=data.name,
            type_id=data.type_id,
            value=data.value,
            note=data.note,
        )

        if data.file:
            f = FileInputMapper().mapping(data.file)
            abr = data.file.name.split(".")[-1]
            if abr and abr in IMAGES:
                p.material = {"img": f}
            else:
                p.material = {"file": f}
        else:
            p.material = {}

        if data.activity_id:
            p.activity_id = data.activity_id
        elif data.group_id:
            p.group_id = data.group_id
        else:
            p.user_id = id

        if data.getted_at:
            p.getted_at = data.getted_at
        return p


class PortfolioUpdInputMapper(BaseMapper[PortfolioUpdateSchema, Portfolio]):
    def mapping(self, data: PortfolioUpdateSchema, portfolio_db: Portfolio):
        if data.name:
            portfolio_db.name = data.name
        if data.note:
            portfolio_db.note = data.note
        if data.type_id:
            portfolio_db.type_id = data.type_id
        if data.value:
            portfolio_db.value = data.value
        if data.getted_at:
            portfolio_db.getted_at = data.getted_at
        if data.file:
            f = FileInputMapper().mapping(data.file)
            abr = data.file.name.split(".")[-1]
            if abr and abr in IMAGES:
                portfolio_db.material = {"img": f}
            else:
                portfolio_db.material = {"file": f}
        elif data.delete_file_id:
            portfolio_db.material = {}
        return portfolio_db


class PortfolioTagLinkInputMapper(BaseMapper[int, TagPortfolio]):
    def mapping(self, id: int, tag_id: int):
        return TagPortfolio(portfolio_id=id, tag_id=tag_id)


class PortfolioDBMapper(BaseMapper[Portfolio, FullPortfolioSchema]):
    def mapping(self, portfolio: Portfolio):
        return FullPortfolioSchema.from_orm(portfolio)
