from sqlalchemy import Integer, String, Column

from src.database.base import Base


class Direction(Base):
    __tablename__ = "directions"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    icon = Column(String(255))
