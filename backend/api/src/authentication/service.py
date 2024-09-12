from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import ValidationError
import secrets

from src.database.exceptions import *
from src.authentication.mappers import *
from src.authentication.consts import *
from src.authentication.exceptions import *
from src.common.schemas import MessageSchema
from src.authentication.schemas import RecoverPasswordSchema, SignupScheme
from src.common.services.unit_of_work import IUnitOfWork
from src.user.exceptions import GetUserByEmailException
from src.token.consts import REFRESH_TOKEN
from src.token.service import TokenService
from src.token.schemas import TokenDataSchema, TokenSchema
from src.config import settings


class AuthenticationService:
    def __init__(self, uow: IUnitOfWork, token_service: TokenService):
        self.__uow = uow
        self.__pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.__token_service = token_service

    async def public_signup(self, user_details: SignupScheme):
        async with self.__uow:
            try:
                mapper = UserInputMapper()
                await self.__check_exist_user(user_details.email, self.__uow)
                user_details.password = self.__get_password_hash(user_details.password)
                user_db = mapper.mapping(user_details)
                await self.__uow.users.add(user_db)

                key = secrets.token_urlsafe(16)
                record = RecordRedisInputMapper().mapping(key, user_details.email)
                if await self.__uow.pswd_recoveries.add(record):
                    await self.__uow.commit()
                    return (
                        MessageSchema(message=REGISTATION_SUCCESS),
                        f"{settings.URL_FRONTEND}/auth/signin?code={key}",
                        user_details.email,
                        user_details.firstname,
                    )
            except UniqueViolationException as e:
                raise AccountExistException() from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(ROLE_ID_FAILED) from e
            except AddItemException as e:
                raise AnyServiceException(REGISTATION_FAILED) from e

    async def signin(self, form_data: OAuth2PasswordRequestForm) -> TokenSchema:
        async with self.__uow:
            try:
                user_login = SigninInputMapper().mapping(form_data)
                user_db = await self.__check_exist_user(
                    user_login.email, self.__uow, False
                )
                if not user_db.is_active:
                    raise NotActiveException() from None
                if not self.__verify_password(
                    user_login.password, user_db.hashed_password
                ):
                    raise InvalidPasswordException() from None
                d = TokenDataSchema.Of(user_db.id, user_db.role_id)
                return (
                    self.__token_service.generate_tokens(d),
                    user_login.email,
                    user_db.id,
                )
            except ValidationError as e:
                raise IncorrectEmailException() from e

    def refresh_token(self, credentials: HTTPAuthorizationCredentials):
        data = self.__token_service.decode_token(credentials.credentials, REFRESH_TOKEN)
        return self.__token_service.generate_tokens(data)

    async def recover_password(
        self, data: RecoverPasswordSchema, time: int = EXPIRES_10_MIN_CACHE_ON_SECONDS
    ):
        async with self.__uow:
            try:
                await self.__check_exist_user(data.email, self.__uow, False)
                key = secrets.token_urlsafe(16)
                record = RecordRedisInputMapper().mapping(key, data.email, time)
                if await self.__uow.pswd_recoveries.add(record):
                    return (
                        MessageSchema(message=URL_SEND_SUCCESS),
                        f"{settings.URL_FRONTEND}/auth/reset?code={key}",
                        data.email,
                    )
                raise BadRequestException(CODE_SEND_FAILED)
            except AddItemException as e:
                raise AnyServiceException(CODE_SEND_FAILED) from e

    async def activation(self, data: ActivationSchema):
        async with self.__uow:
            record = await self.__uow.activations.pop(data.code)
            if record:
                email = PasswordRecoveryMapper().mapping(record)
                user = await self.__check_exist_user(email, self.__uow, False)
                user.is_active = True
                await self.__uow.user_abstracts.update(user)
                await self.__uow.commit()
                return MessageSchema(message=ACTIVATION_SUCCESS)
            raise BadRequestException(ACTIVATION_CODE_INVALID)

    async def reset_password(self, data: ResetPasswordSchema):
        async with self.__uow:
            record = await self.__uow.pswd_recoveries.pop(data.code)
            if record:
                email = PasswordRecoveryMapper().mapping(record)
                user = await self.__check_exist_user(email, self.__uow, False)
                user.hashed_password = self.__get_password_hash(data.password)
                await self.__uow.user_abstracts.update(user)
                await self.__uow.commit()
                return MessageSchema(message=PASSWORD_SUCCESS_RESET)
            raise BadRequestException(CODE_INVALID)

    def __verify_password(self, plain_password, hashed_password):
        return self.__pwd_context.verify(plain_password, hashed_password)

    def __get_password_hash(self, password):
        return self.__pwd_context.hash(password)

    async def __check_exist_user(
        self, email: str, uow: IUnitOfWork, exist_error: bool = True
    ):
        try:
            user = await uow.user_abstracts.get_by_email(email)
            if user:
                if exist_error:
                    raise AccountExistException() from None
                return user
            elif not exist_error:
                raise InvalidUsernameException() from None
        except GetUserByEmailException as e:
            raise CheckExistException() from e
