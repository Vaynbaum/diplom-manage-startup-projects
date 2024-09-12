from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_statistics(access_token):
    response = client.get("/admin/statistics", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert "activity" in result
    assert "group" in result


def test_get_activity_statistics(access_token):
    response = client.get("/admin/activity/statistics", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert "xaxis" in result
    assert "series" in result


def test_get_tag_statistics(access_token):
    response = client.get("/admin/tag/statistics", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert "xaxis" in result
    assert "series" in result
