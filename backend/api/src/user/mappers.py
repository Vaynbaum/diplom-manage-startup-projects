from src.common.utils import keySortCreatedAt, keySortGettedAt
from src.file.schemas import FileSchema
from src.group.schemas import *
from src.database.models import *
from src.common.mappers import BaseMapper
from src.user.schemas import *


class CityInputMapper(BaseMapper[CityUpdateSchema, City]):
    def mapping(self, data: CityUpdateSchema):
        if data.region_id:
            return City(name=data.name, region_id=data.region_id)
        else:
            r = None
            if data.region_name:
                r = Region(name=data.region_name)
            return City(name=data.name, region=r)


class ContactUserInputMapper(BaseMapper[ContactAddSchema, ContactUser]):
    def mapping(self, link: ContactAddSchema, id: int):
        return ContactUser(user_id=id, value=link.value, contact_id=link.contact_id)


class ProfileInputMapper(BaseMapper[UserUpdateSchema, UserAbstract]):
    def mapping(self, data: UserUpdateSchema, user_abstract_db: UserAbstract):
        if data.username:
            user_abstract_db.username = data.username
        elif not user_abstract_db.username:
            user_abstract_db.username = f"id{user_abstract_db.id}"

        if data.firstname and user_abstract_db.firstname != data.firstname:
            user_abstract_db.firstname = data.firstname
        if data.lastname and user_abstract_db.lastname != data.lastname:
            user_abstract_db.lastname = data.lastname

        if user_abstract_db.user:
            if data.birthdate and user_abstract_db.user.birthdate != data.birthdate:
                user_abstract_db.user.birthdate = data.birthdate

            if data.city:
                if data.city.id:
                    user_abstract_db.user.city_id = data.city.id
                else:
                    m = CityInputMapper()
                    if (
                        not user_abstract_db.user.city
                        or user_abstract_db.user.city.name != data.city.name
                    ):
                        user_abstract_db.user.city = m.mapping(data.city)

        return user_abstract_db


class AvatarDBMapper(BaseMapper[dict, AvatarSchema]):
    def mapping(self, avatar: dict):
        return AvatarSchema(**avatar)


class AvatarInputMapper(BaseMapper[FileSchema, dict]):
    def mapping(self, res: FileSchema):
        return {"id": res.id, "url": res.name}


class FileInputMapper(BaseMapper[FileSchema, dict]):
    def mapping(self, res: FileSchema):
        return res.model_dump()


class DecorationDBMapper(BaseMapper[dict, DecorationSchema]):
    def mapping(self, decoration: dict):
        return DecorationSchema(**decoration)


class DecorationInputMapper(BaseMapper[FileSchema, dict]):
    def mapping(self, res: FileSchema):
        return {"id": res.id, "coverImage": res.name}


class UserAbstract2DBMapper(BaseMapper[User, ShortUserWithUserAbstractSchema]):
    def mapping(self, user_abstract: User):
        u = ShortUserWithUserAbstractSchema.from_orm(user_abstract)
        for f in u.favorites:
            f.favorite = f.favorite.user_abstract
        for f in u.subscribers:
            f.subscriber = f.subscriber.user_abstract

        u.favorites.sort(key=keySortCreatedAt)
        u.subscribers.sort(key=keySortCreatedAt)
        return u


class UserAbstractDBMapper(BaseMapper[UserAbstract, UserAbstractSchema]):
    def mapping(self, user_abstract: UserAbstract):
        u = UserAbstractSchema.from_orm(user_abstract)

        if u.user:
            for f in u.user.favorites:
                f.favorite = f.favorite.user_abstract

            for f in u.user.subscribers:
                f.subscriber = f.subscriber.user_abstract
            u.user.favorites.sort(key=keySortCreatedAt)
            u.user.subscribers.sort(key=keySortCreatedAt)
            u.user.groups.sort(key=keySortCreatedAt)
            u.user.portfolios.sort(key=keySortGettedAt)
        return u


class SubscriptionInputMapper(BaseMapper[int, Subscription]):
    def mapping(self, id: int, favorite_id: int):
        return Subscription(subscriber_id=id, favorite_id=favorite_id)
