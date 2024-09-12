from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.database.models.group.vacancy import Vacancy
from src.database.models.user.user import User
from src.database.base import Base


class VacancyUser(Base):
    __tablename__ = "vacancy_users"
    vacancy_id = Column(Integer, ForeignKey(Vacancy.id), primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    is_approved = Column(Boolean, nullable=True)

    vacancy = relationship(
        Vacancy, backref=backref("users", cascade="all, delete-orphan")
    )
    user = relationship(
        User, backref=backref("my_vacancies", cascade="all, delete-orphan")
    )
