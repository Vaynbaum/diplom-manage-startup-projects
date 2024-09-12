from fastapi import UploadFile
import requests_async as req_async

from src.common.exceptions import *
from src.common.schemas import MessageSchema
from src.common.utils import handle_error
from src.file.consts import *
from src.file.schemas import FileSchema
from src.token.consts import *
from src.config import settings


class FileService:
    def __init__(self):
        self.__url = f"{settings.FILE_MANAGER_URL}/{PATH_FILES}/"

    async def post_file(self, file: UploadFile, token: str):
        headers = self.__compile_headers(token)
        files = {NAME_FIELD_FILE: (file.filename, file.file, file.content_type)}
        res = await req_async.post(self.__url, headers=headers, files=files)
        return FileSchema(**handle_error(res))

    async def delete_file(self, id: int, token: str):
        headers = self.__compile_headers(token)
        res = await req_async.delete(self.__url, headers=headers, params={"id": id})
        return MessageSchema(**handle_error(res))

    def __compile_headers(self, token: str):
        return {AUTHORIZATION: f"{TOKEN_TYPE_BEARER} {token}"}
