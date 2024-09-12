from sqlalchemy import DateTime, ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref
from datetime import datetime

from src.database.base import Base
from src.database.models.user.user import User


class Subscription(Base):
    __tablename__ = "subscriptions"
    subscriber_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    favorite_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    created_at = Column(DateTime, default=datetime.now)

    subscriber = relationship(
        User,
        foreign_keys=subscriber_id,
        backref=backref("favorites", cascade="all, delete-orphan"),
    )
    favorite = relationship(
        User,
        foreign_keys=favorite_id,
        backref=backref("subscribers", cascade="all, delete-orphan"),
    )
