from sqlalchemy import JSON, Column, Integer, String

from src.database.base import Base


class PortfolioType(Base):
    __tablename__ = "portfolio_types"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    details = Column(JSON, nullable=True)
