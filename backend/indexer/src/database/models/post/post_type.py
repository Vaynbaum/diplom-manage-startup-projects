from sqlalchemy import Column, Integer, String

from src.database.base import Base


class PostType(Base):
    __tablename__ = "post_types"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
