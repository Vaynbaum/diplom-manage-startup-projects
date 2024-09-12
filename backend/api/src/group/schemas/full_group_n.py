from typing import List

from src.group.schemas.group import GroupSchema
from src.group.schemas.group_user2 import GroupUser2SNchema


class FullGroupWithUsers(GroupSchema):
    users: List[GroupUser2SNchema]

    class Config:
        from_attributes = True
