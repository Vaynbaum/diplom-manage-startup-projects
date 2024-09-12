from datetime import datetime
from sqlalchemy import JSON, Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.activity import Activity
from src.database.models.activity.activity_task_status import ActivityTaskStatus
from src.database.models.user.user import User
from src.database.base import Base


class ActivityTask(Base):
    __tablename__ = "activity_tasks"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    creater_id = Column(Integer, ForeignKey(User.id))
    activity_id = Column(Integer, ForeignKey(Activity.id))
    status_id = Column(Integer, ForeignKey(ActivityTaskStatus.id))
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    materials = Column(JSON, nullable=True)

    creater = relationship(
        User, backref=backref("my_tasks", cascade="all, delete-orphan")
    )
    status = relationship(ActivityTaskStatus, backref="tasks")
    activity = relationship(
        Activity, backref=backref("tasks", cascade="all, delete-orphan")
    )
