from typing import List
from fastapi.security import HTTPBearer
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CORS_URL: List[str]
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST: str
    PORT: str
    SECRET_STRING: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    

    class Config:
        env_file = ".env"


settings = Settings()
OAuth2Scheme = HTTPBearer()
