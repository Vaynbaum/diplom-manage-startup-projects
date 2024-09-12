from sqlalchemy import ForeignKey, Integer, Column, String
from sqlalchemy.orm import relationship, backref

from src.database.models.activity.activity import Activity
from src.database.models.other.contact import Contact
from src.database.base import Base


class ContactActivity(Base):
    __tablename__ = "contact_activities"
    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey(Contact.id))
    activity_id = Column(Integer, ForeignKey(Activity.id))
    value = Column(String(255), nullable=False)

    contact = relationship(Contact, backref="activities")
    activity = relationship(
        Activity, backref=backref("contacts", cascade="all, delete-orphan")
    )
