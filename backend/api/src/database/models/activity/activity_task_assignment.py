from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.database.base import Base
from src.database.models.activity.activity_task import ActivityTask
from src.database.models.user.user import User


class ActivityTaskAssignment(Base):
    __tablename__ = "activity_task_assignments"
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    task_id = Column(Integer, ForeignKey(ActivityTask.id), primary_key=True)
    created_at = Column(DateTime, default=datetime.now)

    user = relationship(User, backref=backref("tasks", cascade="all, delete-orphan"))
    task = relationship(
        ActivityTask, backref=backref("users", cascade="all, delete-orphan")
    )
