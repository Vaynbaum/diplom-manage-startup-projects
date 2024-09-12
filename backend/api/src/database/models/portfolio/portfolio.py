from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.activity import Activity
from src.database.models.group.group import Group
from src.database.models.portfolio.portfolio_type import PortfolioType
from src.database.models.user.user import User
from src.database.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    note = Column(Text, nullable=True)
    value = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=True)
    group_id = Column(Integer, ForeignKey(Group.id), nullable=True)
    activity_id = Column(Integer, ForeignKey(Activity.id), nullable=True)
    getted_at = Column(DateTime)

    material = Column(JSON, nullable=True)
    type_id = Column(Integer, ForeignKey(PortfolioType.id))

    user = relationship(
        User, backref=backref("portfolios", cascade="all, delete-orphan")
    )
    group = relationship(
        Group, backref=backref("portfolios", cascade="all, delete-orphan")
    )
    activity = relationship(
        Activity, backref=backref("portfolios", cascade="all, delete-orphan")
    )
    type = relationship(
        PortfolioType, backref=backref("portfolios", cascade="all, delete-orphan")
    )
