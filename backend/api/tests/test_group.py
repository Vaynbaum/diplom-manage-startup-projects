from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_types():
    response = client.get("/groups/types/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_groups():
    response = client.get("/groups/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0


def test_get_my_groups(access_token):
    response = client.get("/groups/all/my", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_group():
    response = client.get("/groups/one", params={"id": 1})
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_group_roles():
    response = client.get("/groups/roles", params={"group_id": 1})
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_vacancy():
    response = client.get("/groups/vacancy/one", params={"vacancy_id": 1})
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_vacancy_responses():
    response = client.get("/groups/vacancy/responses", params={"vacancy_id": 1})
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0
