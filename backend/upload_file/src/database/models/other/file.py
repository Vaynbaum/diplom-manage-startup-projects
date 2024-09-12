from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime

from src.database.base import Base
from src.database.models.user.user_abstract import UserAbstract


class FileModel(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    owner_id = Column(Integer, ForeignKey(UserAbstract.id))
    details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship(UserAbstract, backref="files")
