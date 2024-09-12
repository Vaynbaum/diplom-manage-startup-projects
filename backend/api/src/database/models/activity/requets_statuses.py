from sqlalchemy import Column, Integer, String

from src.database.base import Base


class RequestStatus(Base):
    __tablename__ = "requets_statuses"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
