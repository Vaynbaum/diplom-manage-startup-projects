from sqlalchemy import Boolean, Column, ForeignKey, Integer

from src.database.base import Base


class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, ForeignKey("user_abstracts.id"), primary_key=True)
    is_super = Column(Boolean, default=False)
