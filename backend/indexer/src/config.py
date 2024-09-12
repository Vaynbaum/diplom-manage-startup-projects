from typing import List
from pydantic_settings import BaseSettings
from typesense import Client

from src.common.consts import *


class CommonSettings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST: str
    PORT: str

    TIMEOUT_SECS: int
    NLTK_MODEL_NAME: str
    NODE_URLS: List[dict]
    API_KEY: str

    class Config:
        env_file = FILE_ENV


settings = CommonSettings()

TypesenseCon = Client(
    {
        "api_key": settings.API_KEY,
        "nodes": settings.NODE_URLS,
        "connection_timeout_seconds": settings.TIMEOUT_SECS,
    }
)

ActivitiesSchema = {
    "name": NAME_SCHEMA_ACTIVITY,
    "fields": [
        {"name": "activity_id", "type": "int32"},
        {"name": "tags", "type": "string[]", "locale": "ru", "stem": True},
        {"name": "name", "type": "string", "locale": "ru", "stem": True},
        {
            "name": "description",
            "type": "string",
            "locale": "ru",
            "stem": True,
            "optional": True,
        },
        {"name": "direction", "type": "string", "locale": "ru", "stem": True},
        {
            "name": "embedding",
            "type": "float[]",
            "embed": {
                "from": ["name", "description", "direction", "tags"],
                "model_config": {"model_name": settings.NLTK_MODEL_NAME},
            },
        },
    ],
}
GroupsSchema = {
    "name": NAME_SCHEMA_GROUP,
    "fields": [
        {"name": "group_id", "type": "int32"},
        {"name": "name", "type": "string", "locale": "ru","stem": True},
        {"name": "username", "type": "string", "locale": "ru","optional": True},
        {
            "name": "note",
            "type": "string",
            "locale": "ru",
            "stem": True,
            "optional": True,
        },
        {
            "name": "embedding",
            "type": "float[]",
            "embed": {
                "from": ["name", "note"],
                "model_config": {"model_name": settings.NLTK_MODEL_NAME},
            },
        },
    ],
}
PostsSchema = {
    "name": NAME_SCHEMA_POST,
    "fields": [
        {"name": "post_id", "type": "int32"},
        {"name": "tags", "type": "string[]","locale": "ru", "stem": True},
        {
            "name": "text",
            "type": "string",
            "locale": "ru",
            "stem": True,
            "optional": True,
        },
        {
            "name": "embedding",
            "type": "float[]",
            "embed": {
                "from": ["text", "tags"],
                "model_config": {"model_name": settings.NLTK_MODEL_NAME},
            },
        },
    ],
}
UsersSchema = {
    "name": NAME_SCHEMA_USER,
    "fields": [
        {"name": "user_id", "type": "int32"},
        {"name": "firstname", "type": "string", "locale": "ru","stem": True},
        {"name": "lastname", "type": "string", "locale": "ru"},
        {"name": "email", "type": "string", "locale": "ru"},
        {"name": "username", "type": "string","locale": "ru", "optional": True},
        {"name": "tags", "type": "string[]", "locale": "ru","stem": True},
        {
            "name": "city",
            "type": "string",
            "locale": "ru",
            "stem": True,
            "optional": True,
        },
    ],
}
