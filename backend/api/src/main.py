from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.common.exceptions import ServiceException
from src.routers import Routers
from src.common.utils import handle_service_exception


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(ServiceException, handle_service_exception)


for router in Routers:
    app.include_router(router)
