from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.database.models.group.group import Group
from src.database.models.user.user import User
from src.database.base import Base


class GroupInvite(Base):
    __tablename__ = "group_invites"
    group_id = Column(Integer, ForeignKey(Group.id), primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    is_approved = Column(Boolean, nullable=True)

    group = relationship(
        Group, backref=backref("invites", cascade="all, delete-orphan")
    )
    user = relationship(User, backref=backref("invites", cascade="all, delete-orphan"))
