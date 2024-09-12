from sqlalchemy import ForeignKey, Integer, Column, String
from sqlalchemy.orm import relationship, backref

from src.database.models.other.contact import Contact
from src.database.base import Base
from src.database.models.user.user import User


class ContactUser(Base):
    __tablename__ = "contact_users"
    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey(Contact.id))
    user_id = Column(Integer, ForeignKey(User.id))
    value = Column(String(255), nullable=False)

    contact = relationship(Contact, backref="users")
    user = relationship(User, backref=backref("contacts", cascade="all, delete-orphan"))
