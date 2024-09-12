from src.database.exceptions import DBException
from src.common.exceptions import *
from src.user.phrases import *


class GetUserByEmailException(DBException):
    """Ошибка получения пользователя по email"""

    def __init__(self, email: str):
        super().__init__(f"{GET_USER_BY_EMAIL_EXCEPTION} {email}")


class GetUserByIdException(AnyServiceException):
    def __init__(self, message: str = GET_USER_BY_ID_EXCEPTION):
        super().__init__(message)


class InvalidUserIdException(NotFoundException):
    def __init__(self, message: str = INVALID_USER_ID):
        super().__init__(message)


class GetResetEmailException(AnyServiceException):
    def __init__(self, message: str = RESET_EMAIL_FAILED):
        super().__init__(message)


# class GetAvailableRolesException(DBException):
#     """Ошибка получения доступных ролей"""

#     def __init__(self):
#         super().__init__(f"Не удалось получить доступные роли")
