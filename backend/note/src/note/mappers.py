from src.database.models import *
from src.common.mappers import BaseMapper
from src.note.schemas import *


class JSONInputMapper(BaseMapper[dict, ReadNoteSchema]):
    def mapping(self, data: dict):
        return ReadNoteSchema(**data)


class NotificationInputMapper(BaseMapper[NoteInputSchema, Notification]):
    def mapping(self, data: NoteInputSchema):
        return Notification(text=data.text, user_abstract_id=data.user_id)


class NotificationDBMapper(BaseMapper[Notification, NotificationSchema]):
    def mapping(self, note_db: Notification):
        return NotificationSchema.model_validate(note_db)
