from sqlalchemy import Integer, String, Column

from src.database.base import Base


class TagLevel(Base):
    __tablename__ = "tag_levels"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    icon = Column(String(255), nullable=True)
