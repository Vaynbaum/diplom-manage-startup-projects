import asyncio

from src.config import CeleryConnection
from src.note.depends import create_note_service
from src.note.schemas import NoteInputSchema


note_service = create_note_service()


@CeleryConnection.task
def send_note(text: str, id: int):
    data = NoteInputSchema(text=text, user_id=id)
    coro = note_service.send_note(data)
    asyncio.run(coro)
