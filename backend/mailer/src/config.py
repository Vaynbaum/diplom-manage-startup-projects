from pydantic import EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MAIL_USERNAME: EmailStr
    MAIL_PASSWORD: str
    MAIL_PORT: int
    LOGO_URL: str
    PATH_TEMPLATE: str

    class Config:
        env_file = ".env"


settings = Settings()
