from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.activity import Activity
from src.database.models.group.group import Group
from src.database.models.post.post_type import PostType
from src.database.models.user.user import User
from src.database.base import Base


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=True)
    group_id = Column(Integer, ForeignKey(Group.id), nullable=True)
    activity_id = Column(Integer, ForeignKey(Activity.id), nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    materials = Column(JSON, nullable=True)
    type_id = Column(Integer, ForeignKey(PostType.id))

    user = relationship(User, backref=backref("posts", cascade="all, delete-orphan"))
    group = relationship(Group, backref=backref("posts", cascade="all, delete-orphan"))
    activity = relationship(
        Activity, backref=backref("posts", cascade="all, delete-orphan")
    )
    type = relationship(
        PostType, backref=backref("posts", cascade="all, delete-orphan")
    )
    tags = relationship("TagPost")
