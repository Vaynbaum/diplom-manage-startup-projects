import vakt
from vakt.rules import Eq, Truthy, Any, NotEq

from src.common.utils import IncrementorId
from src.common.const import *
from src.group.const import ROLE_ID_GROUP_OBSERER
from src.message.const import *

Incrementor = IncrementorId()

politicians = [
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_ADD)],
        resources=[{"name": Eq(RESOURCE_CON)}],
        subjects=[Any()],
        effect=vakt.ALLOW_ACCESS,
        description="Добавлять соединение могут все",
    ),
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_ADD), Eq(METHOD_GET)],
        resources=[{"name": Eq(RESOURCE_MSG)}],
        subjects=[
            {"role": Eq(ROLE_USER), "is_owner": Truthy()},
            {"role": Eq(ROLE_USER), "role_group": NotEq(ROLE_ID_GROUP_OBSERER)},
        ],
        effect=vakt.ALLOW_ACCESS,
        description="Добавлять и получать сообщения может владелец проекта и все в группе кроме наблюдателей",
    ),
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_DELETE)],
        resources=[{"name": Eq(RESOURCE_MSG)}],
        subjects=[{"role": Eq(ROLE_USER), "is_owner": Truthy()}],
        effect=vakt.ALLOW_ACCESS,
        description="Удалять сообщение может владелец проекта или владелец сообщения",
    ),
]
