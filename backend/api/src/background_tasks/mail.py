from src.mail.depends import create_mail_service
from src.config import CeleryConnection


mailer_service = create_mail_service()


@CeleryConnection.task
def send_url(email: str, url: str):
    mailer_service.send("reset_password", email=email, url=url)


@CeleryConnection.task
def send_greeting(email: str, url: str, name: str | None = None):
    mailer_service.send("greeting", email=email, url=url, name=name)


@CeleryConnection.task
def send_warn_signin(email: str):
    mailer_service.send("warning_signin", email=email)
