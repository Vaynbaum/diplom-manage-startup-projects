from fastapi import WebSocket

from src.authorization.schemas import ResultCheck
from src.common.exceptions import ForbiddenException, ServiceException
from src.connect.phrases import CONNECTED_ALREADY


class ConnectionService:
    def __init__(self):
        self.__active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, key: int):
        if key:
            if key not in self.__active_connections:
                self.__active_connections[key] = websocket
            else:
                raise ForbiddenException(CONNECTED_ALREADY)

    async def disconnect(self, key: int):
        if key in self.__active_connections:
            self.__active_connections.pop(key)

    async def send_except(
        self, err: ServiceException, websocket: WebSocket, res: ResultCheck | None
    ):
        try:
            msg = err.message
            await websocket.send_json({"msg": msg, "code": err.code})
        except:
            msg = str(err)
            await websocket.send_json({"msg": msg, "code": 500})
        if res:
            await self.disconnect(res.subject.id)
            await websocket.close()

    async def send_personal_message(self, message: dict, keys: list[int]):
        for key in keys:
            if key in self.__active_connections:
                await self.__active_connections[key].send_json(message)

    async def broadcast(self, message: str):
        for connection in self.__active_connections.values():
            await connection.send_text(message)
