from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.tag.tag_level import TagLevel
from src.database.models.tag.tag import Tag
from src.database.base import Base
from src.database.models.user.user import User


class TagUser(Base):
    __tablename__ = "tag_users"
    tag_id = Column(Integer, ForeignKey(Tag.id), primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    level_id = Column(Integer, ForeignKey(TagLevel.id))

    tag = relationship(Tag, backref=backref("users", cascade="all, delete-orphan"))
    user = relationship(User, backref=backref("tags", cascade="all, delete-orphan"))
    level = relationship(TagLevel, backref="tag_users")
