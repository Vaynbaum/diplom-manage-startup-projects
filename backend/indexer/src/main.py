from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.common.exceptions import ServiceException
from src.routers import Routers
from src.common.utils import handle_service_exception, init


@asynccontextmanager
async def lifespan(app: FastAPI):
    init()
    print("Запуск...")
    yield


app = FastAPI(lifespan=lifespan)


app.add_exception_handler(ServiceException, handle_service_exception)


for router in Routers:
    app.include_router(router)
