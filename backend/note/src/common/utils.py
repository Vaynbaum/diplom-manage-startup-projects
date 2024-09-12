from fastapi import Request
from fastapi.responses import JSONResponse

from src.common.mappers import BaseMapper
from src.common.exceptions import *
from src.common.schemas import ResponseItemsSchema


def handle_service_exception(request: Request, exc: ServiceException):
    return JSONResponse(content={"detail": exc.message}, status_code=exc.code)


class IncrementorId:
    def __init__(self):
        self.current_value = 1

    def get_value(self):
        self.current_value += 1
        return self.current_value


def check_count_items(items, phrase: str):
    l = len(items)
    if l == 0:
        raise NotFoundException(phrase)
    return l


def check_exist_item(item, phrase: str | None = None, exeption=NotFoundException):
    if item is None:
        if phrase:
            raise exeption(phrase)
        else:
            raise exeption()


def process_items_from_db(
    items: list,
    phrase_not_found: str,
    mapper: BaseMapper,
    is_resp_schema: bool = True,
    offset: int | None = None,
):
    l = check_count_items(items, phrase_not_found)
    items_pr = [mapper.mapping(i) for i in items]
    if is_resp_schema:
        return ResponseItemsSchema.Of(items_pr, offset, l)
    return items_pr


def process_item_from_db(item, phrase_not_found: str, mapper: BaseMapper):
    check_exist_item(item, phrase_not_found)
    return mapper.mapping(item)
