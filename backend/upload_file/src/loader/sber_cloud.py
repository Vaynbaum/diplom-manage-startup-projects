from fastapi import UploadFile
import requests

from src.common.exceptions import BadRequestException
from src.loader.base import BaseLoaderService
from src.config import settings


class SberCloudLoaderService(BaseLoaderService):
    async def load_file(self, file: UploadFile):
        files = {"file": (file.filename, file.file, file.content_type)}
        payload = {"key": file.filename}
        res = requests.post(settings.FILE_SHARING_URL, data=payload, files=files)
        if res.status_code != 204:
            raise BadRequestException(res.text)
        return True

    async def delete_file(self, filename: str):
        res = requests.delete(f"{settings.FILE_SHARING_URL}/{filename}")
        if res.status_code != 204:
            raise BadRequestException(res.text)
        return True
