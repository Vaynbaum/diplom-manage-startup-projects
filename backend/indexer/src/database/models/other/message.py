from sqlalchemy.orm import relationship, backref
from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text

from src.database.base import Base
from src.database.models.activity.activity import Activity
from src.database.models.user.user import User


class MessageModel(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    materials = Column(JSON)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    activity_id = Column(Integer, ForeignKey(Activity.id))
    sender_id = Column(Integer, ForeignKey(User.id))

    sender = relationship(
        User, backref=backref("messages", cascade="all, delete-orphan")
    )
    activity = relationship(
        Activity, backref=backref("messages", cascade="all, delete-orphan")
    )
