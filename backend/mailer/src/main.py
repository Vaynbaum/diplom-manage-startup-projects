from fastapi import FastAPI, Query
from pydantic import EmailStr
from jinja2 import Template

from src.config import settings
from src.const import *
from src.schemas import MessageSchema
from src.sender import createServer, post


serverSMTP = createServer()

app = FastAPI()


@app.get("/reset_password/")
async def root(email: EmailStr, url: str):
    html = open(settings.PATH_TEMPLATE, encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.MAIL_USERNAME,
            email,
            template.render(
                logo=settings.LOGO_URL,
                header="Восстановление пароля",
                reason=f"запросили сброс пароля для своей учетной записи {COMPANY_NAME}.",
                message="Нажмите кнопку ниже, чтобы сменить пароль.",
                button_name="Восстановить",
                url=url,
                company_name=COMPANY_NAME,
            ),
            SUBJECT_RECOVER_PASSWORD,
            settings.MAIL_PASSWORD,
        )
        return res if res else MessageSchema(mailer_result=SUCCSESS)
    return MessageSchema(mailer_result=FAILDED)


@app.get("/warning_signin/")
async def root(email: EmailStr):
    html = open(settings.PATH_TEMPLATE, encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.MAIL_USERNAME,
            email,
            template.render(
                logo=settings.LOGO_URL,
                header=f"{WARNING}!",
                reason=f"кто-то вошел на ваш аккаунт на платформе {COMPANY_NAME}. Если это были не вы, необходимо сменить пароль.",
                company_name=COMPANY_NAME,
            ),
            SUBJECT_SIGNIN,
            settings.MAIL_PASSWORD,
        )
        return res if res else MessageSchema(mailer_result=SUCCSESS)
    return MessageSchema(mailer_result=FAILDED)


@app.get("/greeting/")
async def root(email: EmailStr, url: str, name: str | None = Query(default=None)):
    html = open(settings.PATH_TEMPLATE, encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.MAIL_USERNAME,
            email,
            template.render(
                logo=settings.LOGO_URL,
                header=f"Добро пожаловать{', ' if name else ''} {name if name else ''}!",
                reason=f"вы зарегистрировались на платформе {COMPANY_NAME}.",
                button_name="Активировать",
                url=url,
                company_name=COMPANY_NAME,
            ),
            SUBJECT_GREETING,
            settings.MAIL_PASSWORD,
        )
        return res if res else MessageSchema(mailer_result=SUCCSESS)
    return MessageSchema(mailer_result=FAILDED)


@app.get("/any_message/")
async def root(email: EmailStr, message: str):
    html = open(settings.PATH_TEMPLATE, encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.MAIL_USERNAME,
            email,
            template.render(
                logo=settings.LOGO_URL,
                header="Уведомление!",
                reason=f"вам пришло сообщение с платформы {COMPANY_NAME}.",
                message=message,
                company_name=COMPANY_NAME,
            ),
            MESSAGE,
            settings.MAIL_PASSWORD,
        )
        return res if res else MessageSchema(mailer_result=SUCCSESS)
    return MessageSchema(mailer_result=FAILDED)
