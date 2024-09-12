import requests_async as req_async
from requests import Response

from src.common.exceptions import *
from src.common.utils import handle_error
from src.config import settings
from src.note.schemas import NoteInputSchema


class NoteService:
    async def send_note(self, data: NoteInputSchema):
        res = await req_async.post(settings.URL_NOTE, json=data.model_dump())
        return handle_error(res)
