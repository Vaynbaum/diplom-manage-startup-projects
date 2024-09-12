from sqlalchemy.orm import relationship, backref
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from src.database.base import Base
from src.database.models.user.user_abstract import UserAbstract


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    text = Column(String(255))
    user_abstract_id = Column(Integer, ForeignKey(UserAbstract.id))
    created_at = Column(DateTime, default=datetime.now)
    is_readed = Column(Boolean, default=False)

    user_abstract = relationship(
        UserAbstract, backref=backref("notifications", cascade="all, delete-orphan")
    )
