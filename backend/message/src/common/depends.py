from src.database.base import AsyncSessionMaker
from src.token.token import TokenService
from src.common.services.unit_of_work import UnitOfWork


def create_uow():
    return UnitOfWork(AsyncSessionMaker)


def create_token_service():
    return TokenService()


# def create_locale_service():
#     return LocaleService(LOCALE_CODES)

# def create_router_exception_handler():
#     return RouterExceptionHandler(create_locale_service())


# def create_validation_exception_handler():
#     return ValidationExceptionHandler(create_locale_service())


# def get_locale(locale: Locales = Query(Locales.ru)) -> str:
#     return locale.value
