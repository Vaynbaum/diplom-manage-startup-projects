from src.common.exceptions import *
from src.file.phrases import *


class FileNotFoundException(NotFoundException):
    def __init__(self, message: str = FILE_NOT_FOUND):
        super().__init__(message)
class FileUniqueNameException(NotFoundException):
    def __init__(self, message: str = FILE_UNIQUE_NAME):
        super().__init__(message)