from typing import List
from fastapi import APIRouter, Depends, Query

from src.common.schemas import *
from src.other.depends import create_other_service
from src.other.service import OtherService
from src.other.schemas import *
from src.common.consts import *
from src.other.consts import *


router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.get(f"/cities/{ALL}", response_model=ResponseItemsSchema[CitySchema])
async def get_all_cities(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    region_id: int = Query(default=None, ge=VALUE_NOT_LESS),
    substr: str = Query(default=None),
    other_service: OtherService = Depends(create_other_service),
):
    return await other_service.get_all_cities(limit, offset, substr, region_id)


@router.get(f"/regions/{ALL}", response_model=ResponseItemsSchema[RegionSchema])
async def get_all_regions(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    substr: str = Query(default=None),
    other_service: OtherService = Depends(create_other_service),
):
    return await other_service.get_all_regions(limit, offset, substr)


@router.get(f"/contacts/{ALL}", response_model=List[ContactSchema])
async def get_all_contacts(
    other_service: OtherService = Depends(create_other_service),
):
    return await other_service.get_all_contacts()
