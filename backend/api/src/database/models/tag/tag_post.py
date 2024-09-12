from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.post.post import Post
from src.database.models.tag.tag import Tag
from src.database.base import Base


class TagPost(Base):
    __tablename__ = "tag_posts"
    tag_id = Column(Integer, ForeignKey(Tag.id), primary_key=True)
    post_id = Column(Integer, ForeignKey(Post.id), primary_key=True)

    tag = relationship(Tag, backref=backref("posts", cascade="all, delete-orphan"))
    post = relationship(Post, backref=backref("tags", cascade="all, delete-orphan"))
