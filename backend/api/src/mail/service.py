import requests

from src.mail.phrases import SEND_FAILED
from src.config import settings


class MailService:
    def send(self, path: str, **kwargs):
        try:
            result = requests.get(f"{settings.URL_MAILER}/{path}/", kwargs)
            print(result)
            if result.status_code != 200:
                print(SEND_FAILED)
            else:
                print(result.text)
            return result
        except Exception as e:
            print(e)
