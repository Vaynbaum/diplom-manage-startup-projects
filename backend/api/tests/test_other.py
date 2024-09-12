from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_cities():
    response = client.get("/others/cities/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0


def test_get_regions():
    response = client.get("/others/regions/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0


def test_get_contacts():
    response = client.get("/others/contacts/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
