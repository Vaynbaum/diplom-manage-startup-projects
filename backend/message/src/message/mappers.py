from src.database.models import *
from src.common.mappers import BaseMapper
from src.message.schemas import *


class JSONInputMapper(BaseMapper[dict, MessageInputSchema]):
    def mapping(self, data: dict):
        return MessageInputSchema(**data)


class MessageInputMapper(BaseMapper[MessageInputSchema, MessageModel]):
    def mapping(self, data: MessageInputSchema, id: int):
        return MessageModel(
            text=data.text, activity_id=data.activity_id, materials={}, sender_id=id
        )


class MessageDBMapper(BaseMapper[MessageModel, FullMessageSchema]):
    def mapping(self, msg_db: MessageModel, mode: str = "get"):
        msg = FullMessageSchema.model_validate(msg_db)
        msg.sender = msg.sender.user_abstract
        msg.mode = mode
        return msg
