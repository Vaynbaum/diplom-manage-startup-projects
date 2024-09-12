from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class ContactDetailsSchema(BaseModel):
    copy_sucess: str
    copy_fail: str


class ContactSchema(sqlalchemy_to_pydantic(Contact)):
    prefix: str | None = None
    details: ContactDetailsSchema | None = None
    is_redirect: bool | None = None

    class Config:
        from_attributes = True


class ContactUserSchema(sqlalchemy_to_pydantic(ContactUser)):
    contact: ContactSchema | None = None

    class Config:
        from_attributes = True


class ContactGroupSchema(sqlalchemy_to_pydantic(ContactGroup)):
    contact: ContactSchema | None = None

    class Config:
        from_attributes = True


class ContactActivitySchema(sqlalchemy_to_pydantic(ContactActivity)):
    contact: ContactSchema | None = None

    class Config:
        from_attributes = True
