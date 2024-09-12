import asyncio

from src.config import CeleryConnection
from src.file.depends import create_file_service

file_service = create_file_service()


@CeleryConnection.task
def delete_file(id: int, token: str):
    coro = file_service.delete_file(id, token)
    asyncio.run(coro)
