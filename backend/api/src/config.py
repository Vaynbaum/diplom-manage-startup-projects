from typing import List
from fastapi.security import OAuth2PasswordBearer
from pydantic_settings import BaseSettings
from redis import Redis, asyncio as aioredis
from celery import Celery
from typesense import Client

from src.common.consts import FILE_ENV, MAIN_QUEUE_NAME_CELERY
from src.authentication.consts import AUTH_DOMAIN, SIGNIN


class CommonSettings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST: str
    PORT: str

    SECRET_STRING: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    FILE_MANAGER_URL: str
    CORS_URL: List[str]
    URL_MAILER: str
    URL_FRONTEND: str
    URL_NOTE: str

    REDIS_HOST: str
    REDIS_PORT: str

    TIMEOUT_SECS: int
    NODE_URLS: List[dict]
    API_KEY: str

    INDEXER_URL: str

    class Config:
        env_file = FILE_ENV


settings = CommonSettings()

# authorization
OAuth2Scheme = OAuth2PasswordBearer(tokenUrl=f"{AUTH_DOMAIN}/{SIGNIN}")

# connections
REDIS_URL = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
RedisConnection = aioredis.from_url(REDIS_URL, encoding="utf8")
SyncRedisConnection = Redis(settings.REDIS_HOST, settings.REDIS_PORT)
CeleryConnection = Celery(MAIN_QUEUE_NAME_CELERY, broker=REDIS_URL)
TypesenseCon = Client(
    {
        "api_key": settings.API_KEY,
        "nodes": settings.NODE_URLS,
        "connection_timeout_seconds": settings.TIMEOUT_SECS,
    }
)
