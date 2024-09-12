from fastapi import Request
from fastapi.responses import JSONResponse

from src.common.exceptions import *
from src.config import *


def handle_service_exception(request: Request, exc: ServiceException):
    return JSONResponse(content={"detail": exc.message}, status_code=exc.code)


def init():
    try:
        TypesenseCon.collections.create(ActivitiesSchema)
    except Exception as e:
        print(e)

    try:
        TypesenseCon.collections.create(GroupsSchema)
    except Exception as e:
        print(e)

    try:
        TypesenseCon.collections.create(PostsSchema)
    except Exception as e:
        print(e)

    try:
        TypesenseCon.collections.create(UsersSchema)
    except Exception as e:
        print(e)
