from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_activity():
    response = client.get("/activities/one", params={"id": 1})
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_directions():
    response = client.get("/activities/direction/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_statuses():
    response = client.get("/activities/status/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_activities():
    response = client.get("/activities/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0


def test_get_my_activities(access_token):
    response = client.get("/activities/all/my", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_task_statuses():
    response = client.get("/activities/task/status/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_tasks(access_token):
    response = client.get(
        "/activities/task/all",
        params={"activity_id": 1},
        headers={"Authorization": access_token},
    )
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
