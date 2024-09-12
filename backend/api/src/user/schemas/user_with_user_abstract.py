from src.user.schemas.user_abstract_db import UserAbstractDBSchema
from src.user.schemas.user_db import UserDBSchema


class UserWithUserAbstractSchema(UserDBSchema):
    user_abstract: UserAbstractDBSchema

    class Config:
        from_attributes = True



