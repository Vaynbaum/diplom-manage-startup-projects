import vakt
from vakt.rules import Eq, Truthy, Any, NotEq

from src.common.utils import IncrementorId
from src.common.const import *
from src.note.const import RESOURCE_NOTE

Incrementor = IncrementorId()

politicians = [
    vakt.Policy(
        Incrementor.get_value(),
        actions=[Eq(METHOD_GET)],
        resources=[{"name": Eq(RESOURCE_NOTE)}],
        subjects=[Any()],
        effect=vakt.ALLOW_ACCESS,
        description="Получать уведомляния могут все",
    ),
]
