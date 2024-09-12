from src.authentication.phrases import *
from src.common.exceptions import *


class IncorrectEmailException(BadRequestException):
    def __init__(self, message: str = INCORRECT_EMAIL):
        super().__init__(message)


class AccountExistException(BadRequestException):
    def __init__(self, message: str = EMAIL_ALREADY_EXIST):
        super().__init__(message)


class InvalidUsernameException(BadRequestException):
    def __init__(self, message: str = INVALID_USERNAME):
        super().__init__(message)


class InvalidPasswordException(BadRequestException):
    def __init__(self, message: str = INVALID_PASSWORD):
        super().__init__(message)


class NotActiveException(BadRequestException):
    def __init__(self, message: str = IS_NOT_ACTIVE):
        super().__init__(message)


class RecoveryPasswordException(AnyServiceException):
    def __init__(self, message: str = CODE_SEND_FAILED):
        super().__init__(message)


class ResetPasswordException(AnyServiceException):
    def __init__(self, message: str = RESET_PASSWORD_FAILDE):
        super().__init__(message)


class GetInviteException(UnauthorizedException):
    def __init__(self, message: str):
        super().__init__(message)


class CheckExistException(AnyServiceException):
    def __init__(self, message: str = CHECK_EXIST):
        super().__init__(message)


class RegisterHiddenException(AnyServiceException):
    def __init__(self, message: str):
        super().__init__(message)


class InviteNoExistException(BadRequestException):
    def __init__(self, message: str = INVITE_NOT_FOUND):
        super().__init__(message)
