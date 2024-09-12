import datetime
from pydantic import BaseModel, EmailStr, Field


class SignupScheme(BaseModel):
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    password: str = Field(min_length=8)
    email: EmailStr


class SigninSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class SignupHiddenScheme(BaseModel):
    firstname: str
    lastname: str
    patronymic: str | None = None
    birthdate: datetime.date
    phone: str
    password: str
    email: EmailStr
    city_id: int
    citizenship_id: int
    code: str
    organization_id: int | None = None
    training_direction_id: int | None = None


class RecoverPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    code: str = Field(min_length=16)
    password: str = Field(min_length=8)


class ActivationSchema(BaseModel):
    code: str = Field(min_length=16)
