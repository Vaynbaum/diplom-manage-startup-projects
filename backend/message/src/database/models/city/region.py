from sqlalchemy import Integer, String, Column
from src.database.base import Base


class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
