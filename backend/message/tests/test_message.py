from fastapi.testclient import TestClient
from src.main import app
from tests.data import CONNECTED_SUCCESS


client = TestClient(app)


def test_get_messages(access_token):
    response = client.get(
        "/all",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"activity_id": 3},
    )
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0


def test_websocket(access_token):
    with client.websocket_connect(f"/messages?token={access_token}") as websocket:
        data = websocket.receive_json()
        assert data == {"msg": CONNECTED_SUCCESS, "code": 200}
