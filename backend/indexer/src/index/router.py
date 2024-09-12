from fastapi import APIRouter, Depends

from src.index.depends import create_index_service
from src.index.service import IndexService


router = APIRouter()


@router.get(f"/activities")
async def update_state(
    index_service: IndexService = Depends(create_index_service),
):
    return await index_service.update_state()

