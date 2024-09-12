from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_types():
    response = client.get("/posts/types/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_posts():
    response = client.get("/posts/all")
    assert response.status_code == 200
    result = response.json()
    assert "offset" in result
    assert "count" in result
    assert "items" in result
    assert len(result["items"]) > 0
