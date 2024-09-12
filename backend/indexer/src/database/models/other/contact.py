from sqlalchemy import JSON, Boolean, Integer, String, Column
from src.database.base import Base


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    icon = Column(String(255), nullable=False)
    prefix = Column(String(255), nullable=True)
    is_redirect = Column(Boolean, default=False)
    details = Column(JSON, nullable=True)
