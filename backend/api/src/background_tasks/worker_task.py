import requests
from src.config import CeleryConnection, settings

TIME_INTERVAL = 60 * 30


@CeleryConnection.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(TIME_INTERVAL, do_tasks.s(), name="handle tasks")


@CeleryConnection.task()
def do_tasks():
    res = requests.get(f"{settings.INDEXER_URL}/activities")
    if res.status_code == 200:
        print('Индексация прошла успешно')
    else:
        print('Не удалось проиндексировать')
