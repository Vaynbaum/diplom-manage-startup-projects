from abc import ABC, abstractmethod

from fastapi import UploadFile


class BaseLoaderService(ABC):
    @abstractmethod
    async def load_file(self, file: UploadFile):
        raise NotImplementedError()

    @abstractmethod
    async def delete_file(self, filename: str):
        raise NotImplementedError()
