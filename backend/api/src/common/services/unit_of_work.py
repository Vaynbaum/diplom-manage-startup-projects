from abc import ABC, abstractmethod
from typing import Callable
from sqlalchemy.ext.asyncio import AsyncSession
from redis import Redis

from src.activity.repositories import *
from src.authentication.repositories import *
from src.other.repositories import *
from src.group.repositories import *
from src.portfolio.repositories import *
from src.post.repositories import *
from src.user.repositories import *
from src.tag.repositories import *


class IUnitOfWork(ABC):
    pswd_recoveries: IPasswordRecoveryRepository
    activations: IActivationRepository

    roles: IRoleRepository
    users: IUserRepository
    user_abstracts: IUserAbstractRepository
    groups: IGroupRepository
    group_types: IGroupTypeRepository
    group_users: IGroupUserRepository
    group_roles: IGroupRoleRepository
    group_contacts: IContactGroupRepository
    subscriptions: ISubscriptionRepository
    tags: ITagRepository
    tag_users: ITagUserLinkRepository
    tag_activities: ITagActivityLinkRepository
    tag_levels: ITagLevelRepository
    tag_vacancies: ITagVacancyLinkRepository
    contact_users: IContactUserRepository
    cities: ICityRepository
    regions: IRegionRepository
    contacts: IContactRepository
    activities: IActivityRepository
    activity_statuses: IActivityStatusRepository
    directions: IDirectionRepository
    vacancies: IVacancyRepository
    group_invites: IGroupInviteRepository
    vacancy_users: IVacancyUserRepository
    contact_activities: IContactActivityRepository
    activity_requests: IActivityRequestRepository
    activity_tasks: IActivityTaskRepository
    activity_task_assignments: IActivityTaskAssignmentsRepository
    activity_tasks_statuses: IActivityTaskStatusRepository
    posts: IPostRepository
    tag_posts: IPostTagLinkRepository
    post_likes: IPostLikeRepository
    portfolio_types: IPortfolioTypeRepository
    portfolios: IPortfolioRepository
    tag_portfolios: IPortfolioTagLinkRepository
    post_types: IPostTypeRepository

    @abstractmethod
    async def __aenter__(self): ...

    @abstractmethod
    async def __aexit__(self): ...

    @abstractmethod
    async def commit(self):
        raise NotImplementedError()

    @abstractmethod
    async def rollback(self):
        raise NotImplementedError()


class UnitOfWork(IUnitOfWork):
    def __init__(self, session_maker: Callable[[], AsyncSession], redis_conect: Redis):
        self.__session_maker = session_maker
        self.__redis_conect = redis_conect

    async def __aenter__(self):
        self.__session: AsyncSession = self.__session_maker()
        self.users = UserRepository(self.__session)
        self.roles = RoleRepository(self.__session)
        self.user_abstracts = UserAbstractRepository(self.__session)
        self.groups = GroupRepository(self.__session)
        self.group_types = GroupTypeRepository(self.__session)
        self.group_contacts = ContactGroupRepository(self.__session)
        self.subscriptions = SubscriptionRepository(self.__session)
        self.tags = TagRepository(self.__session)
        self.tag_users = TagUserLinkRepository(self.__session)
        self.tag_levels = TagLevelRepository(self.__session)
        self.contact_users = ContactUserRepository(self.__session)
        self.cities = CityRepository(self.__session)
        self.regions = RegionRepository(self.__session)
        self.contacts = ContactRepository(self.__session)
        self.group_users = GroupUserRepository(self.__session)
        self.group_roles = GroupRoleRepository(self.__session)
        self.activities = ActivityRepository(self.__session)
        self.activity_statuses = ActivityStatusRepository(self.__session)
        self.tag_activities = TagActivityLinkRepository(self.__session)
        self.vacancies = VacancyRepository(self.__session)
        self.tag_vacancies = TagVacancyLinkRepository(self.__session)
        self.vacancy_users = VacancyUserRepository(self.__session)
        self.contact_activities = ContactActivityRepository(self.__session)
        self.activity_requests = ActivityRequestRepository(self.__session)
        self.activity_tasks = ActivityTaskRepository(self.__session)
        self.activity_task_assignments = ActivityTaskAssignmentsRepository(
            self.__session
        )
        self.activity_tasks_statuses = ActivityTaskStatusRepository(self.__session)
        self.pswd_recoveries = PasswordRecoveryRepository(self.__redis_conect)
        self.activations = ActivationRepository(self.__redis_conect)
        self.posts = PostRepository(self.__session)
        self.tag_posts = PostTagLinkRepository(self.__session)
        self.post_likes = PostLikeRepository(self.__session)
        self.portfolio_types = PortfolioTypeRepository(self.__session)
        self.portfolios = PortfolioRepository(self.__session)
        self.tag_portfolios = PortfolioTagLinkRepository(self.__session)
        self.post_types = PostTypeRepository(self.__session)
        self.directions = DirectionRepository(self.__session)
        self.group_invites = GroupInviteRepository(self.__session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await self.rollback()
        await self.__session.close()

    async def commit(self):
        await self.__session.commit()

    async def rollback(self):
        await self.__session.rollback()
