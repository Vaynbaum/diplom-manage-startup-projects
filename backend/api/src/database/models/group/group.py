from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.group.group_type import GroupType
from src.database.models.user.user import User
from src.database.base import Base


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    note = Column(Text, nullable=True)
    avatar = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    username = Column(String(255), unique=True, nullable=True)
    decoration = Column(JSON, nullable=True)
    creater_id = Column(Integer, ForeignKey(User.id))
    type_id = Column(Integer, ForeignKey(GroupType.id))

    creater = relationship(
        User, backref=backref("my_groups", cascade="all, delete-orphan")
    )
    type = relationship(GroupType, backref="groups")
