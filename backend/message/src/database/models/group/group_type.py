from sqlalchemy import Column, Integer, String

from src.database.base import Base


class GroupType(Base):
    __tablename__ = "group_types"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
