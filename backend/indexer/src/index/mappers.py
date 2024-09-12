from src.database.models import *
from src.common.mappers import *


class ActivityDBMapper(BaseMapper[Activity, dict]):
    def mapping(self, activity: Activity):
        return {
            "activity_id": activity.id,
            "tags": [t.tag.name for t in activity.tags],
            "name": activity.name,
            "description": activity.description,
            "direction": activity.direction.name,
        }


class GroupDBMapper(BaseMapper[Group, dict]):
    def mapping(self, group: Group):
        return {
            "group_id": group.id,
            "name": group.name,
            "username": group.username,
            "note": group.note,
        }


class PostDBMapper(BaseMapper[Post, dict]):
    def mapping(self, post: Post):
        return {
            "post_id": post.id,
            "tags": [t.tag.name for t in post.tags],
            "text": post.text,
        }


class UserDBMapper(BaseMapper[User, dict]):
    def mapping(self, user: User):
        return {
            "user_id": user.id,
            "firstname": user.user_abstract.firstname,
            "lastname": user.user_abstract.lastname,
            "email": user.user_abstract.email,
            "username": user.user_abstract.username,
            "tags": [t.tag.name for t in user.tags],
            "city": user.city.name if user.city else None,
        }
