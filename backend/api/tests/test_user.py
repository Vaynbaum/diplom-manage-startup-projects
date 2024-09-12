from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_my_profile(access_token):
    response = client.get("/users/profile/one", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_all_profiles():
    response = client.get("/users/profile/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0
