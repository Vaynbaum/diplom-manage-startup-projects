from src.database.models import *
from src.common.mappers import *
from src.tag.schemas import *


class UserTagLinkInputMapper(BaseMapper[int, TagUser]):
    def mapping(self, id: int, tag_id: int, level_id: int):
        return TagUser(user_id=id, tag_id=tag_id, level_id=level_id)


class ActivityTagLinkInputMapper(BaseMapper[int, TagActivity]):
    def mapping(self, id: int, tag_id: int):
        return TagActivity(activity_id=id, tag_id=tag_id)


class VacancyTagLinkInputMapper(BaseMapper[int, TagVacancy]):
    def mapping(self, id: int, tag_id: int, level_id: int):
        return TagVacancy(vacancy_id=id, tag_id=tag_id, level_id=level_id)


class VacancyTagLinkUpdateMapper(BaseMapper[TagVacancy, TagVacancy]):
    def mapping(self, tag_vacancy: TagVacancy, level_id: int):
        tag_vacancy.level_id = level_id
        return tag_vacancy

class UserTagLinkUpdateMapper(BaseMapper[TagUser, TagUser]):
    def mapping(self, tag_user: TagUser, level_id: int):
        tag_user.level_id = level_id
        return tag_user


class TagInputMapper(BaseMapper[str, Tag]):
    def mapping(self, name: str):
        return Tag(name=name)


class TagDBMapper(SimpleDBMapper[Tag, TagSchema]):
    def __init__(self):
        super().__init__(TagSchema)


class LevelDBMapper(SimpleDBMapper[TagLevel, TagLevelSchema]):
    def __init__(self):
        super().__init__(TagLevelSchema)
