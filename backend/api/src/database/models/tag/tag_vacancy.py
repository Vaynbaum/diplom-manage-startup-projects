from sqlalchemy import ForeignKey, Integer, Column
from sqlalchemy.orm import relationship, backref

from src.database.models.group.vacancy import Vacancy
from src.database.models.tag.tag import Tag
from src.database.base import Base
from src.database.models.tag.tag_level import TagLevel


class TagVacancy(Base):
    __tablename__ = "tag_vacancies"
    tag_id = Column(Integer, ForeignKey(Tag.id), primary_key=True)
    vacancy_id = Column(Integer, ForeignKey(Vacancy.id), primary_key=True)
    level_id = Column(Integer, ForeignKey(TagLevel.id))

    tag = relationship(Tag, backref=backref("vacancies", cascade="all, delete-orphan"))
    vacancy = relationship(
        Vacancy, backref=backref("tags", cascade="all, delete-orphan")
    )
    level = relationship(TagLevel, backref="tag_vacancies")
