from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.database.models.user.user import User
from src.database.models.group.group_role import GroupRole
from src.database.models.group.group import Group
from src.database.base import Base


class GroupUser(Base):
    __tablename__ = "group_users"
    group_id = Column(Integer, ForeignKey(Group.id), primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    role_id = Column(Integer, ForeignKey(GroupRole.id))

    role = relationship(GroupRole)
    group = relationship(Group, backref=backref("users", cascade="all, delete-orphan"))
    user = relationship(User, backref=backref("groups", cascade="all, delete-orphan"))
