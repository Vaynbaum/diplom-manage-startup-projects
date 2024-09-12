from sqlalchemy import Column, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship

from src.database.models.city.city import City
from src.database.base import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, ForeignKey("user_abstracts.id"), primary_key=True)
    city_id = Column(Integer, ForeignKey(City.id))
    birthdate = Column(Date, nullable=True)
    
    city = relationship(City, backref="users")
