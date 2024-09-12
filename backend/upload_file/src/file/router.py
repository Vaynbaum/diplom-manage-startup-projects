from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.security import HTTPAuthorizationCredentials

from src.authorization.service import AuthorizationService
from src.common.const import *
from src.common.schemas import MessageSchema
from src.config import OAuth2Scheme
from src.file.const import *
from src.authorization.depends import factory_default_auth
from src.file.depends import *
from src.file.schemas import FileSchema
from src.file.service import FileService

router = APIRouter(prefix=f"/{DOMAIN}", tags=[NAME_SERVICE])


@router.post("/", response_model=FileSchema)
async def upload_file(
    file: UploadFile = File(...),
    gen_blur_img: bool = False,
    token: HTTPAuthorizationCredentials = Depends(OAuth2Scheme),
    file_service: FileService = Depends(create_file_service),
    auth_service: AuthorizationService = Depends(factory_default_auth),
):
    token = token.credentials
    res = await auth_service.check(METHOD_ADD, token, name=RESOURCE_FILE)
    return await file_service.upload_file(file, res.subject, gen_blur_img)


@router.delete("/", response_model=MessageSchema)
async def delete_file(
    id: int = Query(ge=VALUE_NOT_LESS),
    token: HTTPAuthorizationCredentials = Depends(OAuth2Scheme),
    file_service: FileService = Depends(create_file_service),
    auth_service: AuthorizationService = Depends(factory_res_file_auth),
):
    token = token.credentials
    await auth_service.check(METHOD_DELETE, token, name=RESOURCE_FILE, id=id)
    return await file_service.delete_file(id)
