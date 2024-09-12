from src.user.schemas.role import RoleSchema
from src.user.schemas.admin import AdminSchema
from src.user.schemas.user_abstract_user import UserAbstractWithUserDBSchema


class UserAbstractSchema(UserAbstractWithUserDBSchema):
    role: RoleSchema | None = None
    admin: AdminSchema | None = None

    class Config:
        from_attributes = True
