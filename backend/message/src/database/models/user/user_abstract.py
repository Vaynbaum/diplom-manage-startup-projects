from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from src.database.models.user.admin import Admin
from src.database.base import Base
from src.database.models.user.role import Role
from src.database.models.user.user import User


class UserAbstract(Base):
    __tablename__ = "user_abstracts"
    id = Column(Integer, primary_key=True)
    email = Column(String(320), nullable=False, unique=True)
    avatar = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    username = Column(String(255), unique=True, nullable=True)
    hashed_password = Column(String(1024), nullable=False)
    decoration = Column(JSON, nullable=True)
    role_id = Column(Integer, ForeignKey(Role.id))
    firstname = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=False)

    role = relationship(Role, backref="user_abstracts")
    user = relationship(
        User, backref="user_abstract", uselist=False, cascade="all,delete"
    )
    admin = relationship(
        Admin, backref="user_abstract", uselist=False, cascade="all,delete"
    )
