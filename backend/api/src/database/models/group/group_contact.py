from sqlalchemy import ForeignKey, Integer, Column, String
from sqlalchemy.orm import relationship, backref

from src.database.models.group.group import Group
from src.database.models.other.contact import Contact
from src.database.base import Base


class ContactGroup(Base):
    __tablename__ = "contact_groups"
    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey(Contact.id))
    group_id = Column(Integer, ForeignKey(Group.id))
    value = Column(String(255), nullable=False)

    contact = relationship(Contact, backref="groups")
    group = relationship(
        Group, backref=backref("contacts", cascade="all, delete-orphan")
    )
