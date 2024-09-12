import locale

from src.activity.phrases import ACTIVITIES_EXCEPTION
from src.admin.shemas import *
from src.common.exceptions import AnyServiceException
from src.common.services.unit_of_work import IUnitOfWork
from src.database.exceptions import GetAllItemsException


class AdminService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow
        locale.setlocale(locale.LC_TIME, "ru_RU")

    async def get_statistics(self):
        async with self.__uow:
            try:
                activities = await self.__uow.activities.get_full_all(
                    created_at_order=True
                )
                groups = await self.__uow.groups.get_all(created_at_order=True)

                status = {}
                cnt = {}
                for activity in activities:
                    s = activity.status.name
                    if s in status:
                        status[s]["all"] += 1
                        if activity.group_id is None:
                            status[s]["no_group"] += 1
                    else:
                        status[s] = {"all": 1, "no_group": 0}
                        if activity.group_id is None:
                            status[s]["no_group"] = 1

                    date = activity.created_at.strftime("%b. %Y").capitalize()
                    if date in cnt:
                        cnt[date] += 1
                    else:
                        cnt[date] = 1

                cnt2 = {}
                for group in groups:
                    date = group.created_at.strftime("%b. %Y").capitalize()
                    if date in cnt2:
                        cnt2[date] += 1
                    else:
                        cnt2[date] = 1

                a = ActivityStatisticsSchema(
                    created=CreatedStatisticsSchema(
                        date=[d for d in cnt.keys()],
                        cnt=[d for d in cnt.values()],
                    ),
                    status=StatusActivityStatisticsSchema(
                        all=[k["all"] for k in status.values()],
                        no_group=[k["no_group"] for k in status.values()],
                        status=[k for k in status.keys()],
                    ),
                )
                g = GroupStatisticsSchema(
                    created=CreatedStatisticsSchema(
                        date=[d for d in cnt2.keys()],
                        cnt=[d for d in cnt2.values()],
                    )
                )
                return StatisticsSchema(activity=a, group=g)
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e

    async def get_activity_statistics(self):
        async with self.__uow:
            try:
                activities = await self.__uow.activities.get_full_all()
                report = {}
                xaxis = set()
                series = []
                for activity in activities:
                    s_name = activity.status.name.split("(")[0].strip()
                    r_by_s = {}
                    if s_name in report:
                        r_by_s = report[s_name]
                    else:
                        report[s_name] = r_by_s

                    d_name = activity.direction.name
                    xaxis.add(d_name)
                    if d_name in r_by_s:
                        r_by_s[d_name] += 1
                    else:
                        r_by_s[d_name] = 1

                for k, v in report.items():
                    data = []
                    for d in xaxis:
                        data.append(v.get(d, 0))
                    series.append({"name": k, "data": data})
                return ColumnActivityStatisticsSchema(xaxis=xaxis, series=series)
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e

    async def get_tag_statistics(self):
        async with self.__uow:
            try:
                posts = await self.__uow.tag_posts.get_top()
                report = {}
                for post in posts:
                    t = post.tag.name
                    if t in report:
                        report[t] += 1
                    else:
                        report[t] = 1
                report = dict(sorted(report.items(), key=lambda item: item[1], reverse=True))
                return ColumnActivityStatisticsSchema(
                    xaxis=[r for r in report.keys()],
                    series=[r for r in report.values()],
                )
            except GetAllItemsException as e:
                raise AnyServiceException(ACTIVITIES_EXCEPTION) from e
