from src.token.phrases import *
from src.common.exceptions import *


class InvalidCredentialsException(UnauthorizedException):
    def __init__(self, message: str = COULD_NOT_VALIDATE):
        super().__init__(message)


class ScopeTokenInvalidException(UnauthorizedException):
    def __init__(self, message: str = TOKEN_INVALID_SCOPE):
        super().__init__(message)


class TokenExpiredException(UnauthorizedException):
    def __init__(self, message: str = TOKEN_EXPIRED):
        super().__init__(message)


class InvalidTokenException(UnauthorizedException):
    def __init__(self, message: str = TOKEN_INVALID):
        super().__init__(message)
