from src.activity.consts import IMAGES
from src.database.models import *
from src.common.mappers import *
from src.post.schemas import *
from src.user.mappers import FileInputMapper


class PostHideMapper(BaseMapper[PostCreateSchema, Post]):
    def mapping(
        self,
        text: str,
        type_id: int,
        activity_id: int | None = None,
        group_id: int | None = None,
    ):
        p = Post(
            text=text,
            type_id=type_id,
            group_id=group_id,
            activity_id=activity_id,
            materials={"files": [], "images": []},
        )
        return p


class PostInputMapper(BaseMapper[PostCreateSchema, Post]):
    def mapping(self, post: PostCreateSchema, id: int):
        arr_imgs = []
        arr_files = []
        am = FileInputMapper()
        for file in post.files:
            f = am.mapping(file)
            abr = file.name.split(".")[-1]

            if abr and abr in IMAGES:
                arr_imgs.append(f)
            else:
                arr_files.append(f)
        p = Post(
            text=post.text,
            type_id=1,
            materials={"files": arr_files, "images": arr_imgs},
        )
        if post.activity_id:
            p.activity_id = post.activity_id
        elif post.group_id:
            p.group_id = post.group_id
        else:
            p.user_id = id
        return p


class PostUpdInputMapper(BaseMapper[PostUpdateSchema, Post]):
    def mapping(self, post: PostUpdateSchema, post_db: Post):
        post_db.text = post.text
        return post_db


class PTypeDBMapper(SimpleDBMapper[PostType, PostTypeSchema]):
    def __init__(self):
        super().__init__(PostTypeSchema)


class PostDBMapper(BaseMapper[Post, FullPostSchema]):
    def mapping(self, group: Post):
        p = FullPostSchema.from_orm(group)
        if p.user:
            p.user = p.user.user_abstract
        p.cnt_like = len(p.likes)
        return p


class LikeInputMapper(BaseMapper[int, PostLike]):
    def mapping(self, post_id: int, user_id: int):
        return PostLike(user_id=user_id, post_id=post_id)


class PostTagLinkInputMapper(BaseMapper[int, TagPost]):
    def mapping(self, id: int, tag_id: int):
        return TagPost(post_id=id, tag_id=tag_id)
