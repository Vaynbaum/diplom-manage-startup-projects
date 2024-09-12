from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref


from src.database.models.activity.activity import Activity
from src.database.models.activity.requets_statuses import RequestStatus
from src.database.models.group.group import Group
from src.database.base import Base


class ActivityRequest(Base):
    __tablename__ = "requests"
    group_id = Column(Integer, ForeignKey(Group.id), primary_key=True)
    activity_id = Column(Integer, ForeignKey(Activity.id), primary_key=True)
    status_id = Column(Integer, ForeignKey(RequestStatus.id))
    created_at = Column(DateTime, default=datetime.now)

    group = relationship(
        Group, backref=backref("requests", cascade="all, delete-orphan")
    )
    activity = relationship(
        Activity, backref=backref("requests", cascade="all, delete-orphan")
    )
    status = relationship(RequestStatus, backref="requests")
