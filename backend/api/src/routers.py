from src.authentication.router import router as auth_router
from src.user.router import router as user_router
from src.group.router import router as group_router
from src.tag.router import router as tag_router
from src.other.router import router as other_router
from src.activity.router import router as activity_router
from src.post.router import router as post_router
from src.portfolio.router import router as portfolio_router
from src.admin.router import router as admin_router


Routers = [
    auth_router,
    user_router,
    group_router,
    tag_router,
    other_router,
    activity_router,
    post_router,
    portfolio_router,
    admin_router,
]
