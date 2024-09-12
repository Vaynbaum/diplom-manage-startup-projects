from src.authorization.phrases import *
from src.common.exceptions import *


class NoAccessAuthorizationException(ForbiddenException):
    def __init__(self, message: str = NO_ACCESS):
        super().__init__(message=message)


class DBAuthorizationException(AnyServiceException):
    def __init__(self, message: str = NO_ACCESS):
        super().__init__(message=message)
