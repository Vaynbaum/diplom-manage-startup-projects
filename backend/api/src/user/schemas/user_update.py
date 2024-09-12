from datetime import date
from typing import List
from pydantic import BaseModel

from src.other.schemas.city import CityUpdateSchema


class ContactAddSchema(BaseModel):
    contact_id: int
    value: str


class UserUpdateSchema(BaseModel):
    username: str | None = None
    firstname: str | None = None
    lastname: str | None = None
    city: CityUpdateSchema | None = None
    birthdate: date | None = None
    add_contacts: List[ContactAddSchema] | None = None
    delete_contacts: List[int] | None = None
