from sqlalchemy import Integer, String, Column

from src.database.base import Base


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
