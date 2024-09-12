from fastapi.testclient import TestClient

from tests.data import PASSWORD, USERNAME
from src.main import app

client = TestClient(app)


def test_signin():
    response = client.post(
        "/auth/signin", data={"username": USERNAME, "password": PASSWORD}
    )
    assert response.status_code == 200
    result = response.json()
    assert "access_token" in result
    assert "refresh_token" in result
    assert "token_type" in result
    assert result["token_type"] == "Bearer"


def test_refresh_token(refresh_token):
    response = client.get(
        "/auth/refresh_token", headers={"Authorization": f"Bearer {refresh_token}"}
    )
    assert response.status_code == 200
    result = response.json()
    assert "access_token" in result
    assert "refresh_token" in result
    assert "token_type" in result
    assert result["token_type"] == "Bearer"
