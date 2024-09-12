from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.direction import Direction
from src.database.models.activity.activity_status import ActivityStatus
from src.database.models.group.group import Group
from src.database.models.user.user import User
from src.database.base import Base


class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    creater_id = Column(Integer, ForeignKey(User.id))
    group_id = Column(Integer, ForeignKey(Group.id))
    created_at = Column(DateTime, default=datetime.now)
    img = Column(JSON, nullable=True)
    decoration = Column(JSON, nullable=True)
    description = Column(Text, nullable=True)
    fields = Column(JSON, nullable=True)
    status_id = Column(Integer, ForeignKey(ActivityStatus.id))
    direction_id = Column(Integer, ForeignKey(Direction.id))

    creater = relationship(
        User, backref=backref("activities", cascade="all, delete-orphan")
    )
    group = relationship(
        Group, backref=backref("activities", cascade="all, delete-orphan")
    )
    direction = relationship(Direction, backref="activities")
    status = relationship(
        ActivityStatus, backref=backref("activities", cascade="all, delete-orphan")
    )
