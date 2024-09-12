from sqlalchemy import Boolean, Column, Integer, String

from src.database.base import Base


class ActivityTaskStatus(Base):
    __tablename__ = "activity_task_statuses"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    is_change = Column(Boolean)
