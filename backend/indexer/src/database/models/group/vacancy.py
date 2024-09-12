from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.group.group import Group
from src.database.base import Base


class Vacancy(Base):
    __tablename__ = "vacancies"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    group_id = Column(Integer, ForeignKey(Group.id))
    is_active = Column(Boolean, default=True)

    group = relationship(
        Group, backref=backref("vacancies", cascade="all, delete-orphan")
    )
