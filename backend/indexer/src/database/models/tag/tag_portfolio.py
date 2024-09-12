from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.portfolio.portfolio import Portfolio
from src.database.models.tag.tag import Tag
from src.database.base import Base


class TagPortfolio(Base):
    __tablename__ = "tag_portfolios"
    tag_id = Column(Integer, ForeignKey(Tag.id), primary_key=True)
    portfolio_id = Column(Integer, ForeignKey(Portfolio.id), primary_key=True)

    tag = relationship(Tag, backref=backref("portfolios", cascade="all, delete-orphan"))
    portfolio = relationship(
        Portfolio, backref=backref("tags", cascade="all, delete-orphan")
    )
