from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.activity import Activity
from src.database.models.tag.tag import Tag
from src.database.base import Base


class TagActivity(Base):
    __tablename__ = "tag_activities"
    tag_id = Column(Integer, ForeignKey(Tag.id), primary_key=True)
    activity_id = Column(Integer, ForeignKey(Activity.id), primary_key=True)

    tag = relationship(Tag, backref=backref("activities", cascade="all, delete-orphan"))
