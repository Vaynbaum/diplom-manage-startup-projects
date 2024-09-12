from typing import Any, List
from pydantic import BaseModel


class CreatedStatisticsSchema(BaseModel):
    date: List[str]
    cnt: List[int]


class StatusActivityStatisticsSchema(BaseModel):
    no_group: List[int]
    all: List[int]
    status: List[str]


class ActivityStatisticsSchema(BaseModel):
    created: CreatedStatisticsSchema
    status: StatusActivityStatisticsSchema


class GroupStatisticsSchema(BaseModel):
    created: CreatedStatisticsSchema


class StatisticsSchema(BaseModel):
    activity: ActivityStatisticsSchema
    group: GroupStatisticsSchema


class ColumnActivityStatisticsSchema(BaseModel):
    xaxis: List[str]
    series: List[int|dict]
