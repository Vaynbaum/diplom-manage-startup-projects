from pydantic import BaseModel, EmailStr, Field


class ResetEmailSchema(BaseModel):
    new_email: EmailStr


class ResetPasswordSchema(BaseModel):
    password: str= Field(min_length=8)
