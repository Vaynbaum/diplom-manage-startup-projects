import vakt
from vakt.rules import Eq, Truthy, Any

from src.common.utils import IncrementorId
from src.common.const import *
from src.file.const import *

Incrementor = IncrementorId()

politicians = [
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_ADD)],
        resources=[Eq(RESOURCE_FILE)],
        subjects=[Any()],
        effect=vakt.ALLOW_ACCESS,
        description="Добавлять файл могут все",
    ),
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_DELETE)],
        resources=[
            {"name": Eq(RESOURCE_FILE), "is_owner": Truthy()},
        ],
        subjects=[Any()],
        effect=vakt.ALLOW_ACCESS,
        description="Удалить файл может только владелец",
    ),
]
