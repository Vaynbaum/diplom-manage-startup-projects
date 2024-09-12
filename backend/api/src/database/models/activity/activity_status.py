from sqlalchemy import  Column, Integer, String

from src.database.base import Base


class ActivityStatus(Base):
    __tablename__ = "activity_statuses"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
