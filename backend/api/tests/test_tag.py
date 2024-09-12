from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_levels():
    response = client.get("/tags/levels/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_posts():
    response = client.get("/tags/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
