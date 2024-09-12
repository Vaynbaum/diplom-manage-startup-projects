from fastapi import APIRouter, Depends

from src.admin.consts import *
from src.admin.depends import create_admin_service
from src.admin.service import AdminService
from src.admin.shemas import *

router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get("/statistics/", response_model=StatisticsSchema)
async def get_statistics(
    admin_service: AdminService = Depends(create_admin_service),
):
    return await admin_service.get_statistics()


@router.get("/activity/statistics/", response_model=ColumnActivityStatisticsSchema)
async def get_activity_statistics(
    admin_service: AdminService = Depends(create_admin_service),
):
    return await admin_service.get_activity_statistics()


@router.get("/tag/statistics/", response_model=ColumnActivityStatisticsSchema)
async def get_tag_activity_statistics(
    admin_service: AdminService = Depends(create_admin_service),
):
    return await admin_service.get_tag_statistics()
