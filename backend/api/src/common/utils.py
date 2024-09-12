from datetime import date
from fastapi import Request
from fastapi.responses import JSONResponse
from requests import Response

from src.common.mappers import BaseMapper
from src.common.exceptions import *
from src.common.schemas import ResponseItemsSchema
from src.common.services.unit_of_work import IUnitOfWork
from src.database.repositories.generic import GenericRepository


def handle_service_exception(request: Request, exc: ServiceException):
    return JSONResponse(content={"detail": exc.message}, status_code=exc.code)


def keySortCreatedAt(item):
    return item.created_at


def keySortGettedAt(item):
    return item.getted_at if item.getted_at else date.today()


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


def handle_error(res: Response):
    status = res.status_code
    content = res.json()
    if status != 200:
        d = content.get("detail", ANY_EXCEPTIONS)
        print(d)
        if status == 400:
            raise BadRequestException(d) from None
        elif status == 404:
            raise NotFoundException(d) from None
        elif status == 401:
            raise UnauthorizedException(d) from None
        elif status == 403:
            raise ForbiddenException(d) from None
        else:
            raise AnyServiceException(d) from None
    return content


async def add_link(
    rep: GenericRepository,
    link,
    m: BaseMapper,
    id,
    tag_id,
    mu: BaseMapper | None = None,
    level_id: int | None = None,
):
    if link is None:
        if level_id:
            link_db = m.mapping(id, tag_id, level_id)
        else:
            link_db = m.mapping(id, tag_id)
        await rep.add(link_db)

    elif mu:
        if level_id:
            link_db = mu.mapping(link, level_id)
        else:
            link_db = mu.mapping(link)
        await rep.update(link_db)


async def add_names(
    uow: IUnitOfWork,
    rep: GenericRepository,
    id: int,
    tag_names: list,
    m,
    tm,
    mu=None,
    **kwargs
):
    len_tag_names = 0
    if tag_names:
        for tag in tag_names:
            len_tag_names += 1
            t = await uow.tags.get_one(name=tag.tag_name)
            if t:
                l = await rep.get_one(tag_id=t.id, **kwargs)
                if mu:
                    await add_link(rep, l, m, id, t.id, mu, tag.level_id)
                else:
                    await add_link(rep, l, m, id, t.id)

            else:
                t = tm.mapping(tag.tag_name)
                t = await uow.tags.add(t)
                if mu:
                    await add_link(rep, None, m, id, t.id, mu, tag.level_id)
                else:
                    await add_link(rep, None, m, id, t.id)
            await uow.commit()
    return len_tag_names


async def add_ids(
    uow: IUnitOfWork,
    rep: GenericRepository,
    id: int,
    tags: list | None,
    m,
    mu=None,
    **kwargs
):
    len_tags = 0
    if tags:
        for t in tags:
            len_tags += 1
            link = await rep.get_one(**kwargs, tag_id=t.tag_id)

            if mu:
                await add_link(rep, link, m, id, t.tag_id, mu, t.level_id)
            else:
                await add_link(rep, link, m, id, t.tag_id)
        await uow.commit()
    return len_tags


def clear_substr(substr: str | None):
    if substr:
        substr = " ".join(substr.split())
        substr = substr.strip()
    return substr
