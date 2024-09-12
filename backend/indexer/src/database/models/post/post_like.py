from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.post.post import Post
from src.database.base import Base
from src.database.models.user.user import User


class PostLike(Base):
    __tablename__ = "post_likes"
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    post_id = Column(Integer, ForeignKey(Post.id), primary_key=True)

    user = relationship(User, backref=backref("likes", cascade="all, delete-orphan"))
    post = relationship(Post, backref=backref("likes", cascade="all, delete-orphan"))
