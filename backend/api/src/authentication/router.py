from fastapi import APIRouter, Depends, Security
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
    OAuth2PasswordRequestForm,
)

from src.authentication.consts import *
from src.authentication.depends import create_authentication_service
from src.authentication.phrases import *
from src.authentication.service import AuthenticationService
from src.authentication.schemas import *
from src.background_tasks.mail import *
from src.background_tasks.note import send_note
from src.common.schemas import MessageSchema
from src.token.schemas import TokenSchema

security = HTTPBearer()
router = APIRouter(prefix=f"/{AUTH_DOMAIN}", tags=[AUTH_NAME_SERVICE])


@router.post(f"/{SIGNUP}", response_model=MessageSchema)
async def public_signup(
    user_details: SignupScheme,
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    res, url, email, name = await auth_service.public_signup(user_details)
    send_greeting.delay(email, url, name)
    return res


@router.post(f"/{SIGNIN}", response_model=TokenSchema)
async def signin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    res, email, id = await auth_service.signin(form_data)
    send_warn_signin.delay(email)
    send_note.delay(SIGNIN_SUCCESS, id)
    return res


@router.get("/refresh_token", response_model=TokenSchema)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    return auth_service.refresh_token(credentials)


@router.post("/password/recover", response_model=MessageSchema)
async def recover_password(
    data: RecoverPasswordSchema,
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    message, url, email = await auth_service.recover_password(data)
    send_url.delay(email, url)
    return message


@router.post("/password/reset", response_model=MessageSchema)
async def reset_password(
    data: ResetPasswordSchema,
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    return await auth_service.reset_password(data)


@router.post("/activation", response_model=MessageSchema)
async def activation(
    data: ActivationSchema,
    auth_service: AuthenticationService = Depends(create_authentication_service),
):
    return await auth_service.activation(data)
