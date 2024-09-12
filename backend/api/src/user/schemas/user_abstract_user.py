from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user import UserSchema


class UserAbstractWithUserDBSchema(UserAbstractDBSchema):
    user: UserSchema | None = None

    class Config:
        from_attributes = True
