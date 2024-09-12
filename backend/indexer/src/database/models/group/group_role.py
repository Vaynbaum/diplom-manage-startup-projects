from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.database.models.group.group import Group
from src.database.base import Base


class GroupRole(Base):
    __tablename__ = "group_roles"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    is_common = Column(Boolean, default=False)

    group_id = Column(Integer, ForeignKey("groups.id"))
    group = relationship(
        Group, backref=backref("own_roles", cascade="all, delete-orphan")
    )
