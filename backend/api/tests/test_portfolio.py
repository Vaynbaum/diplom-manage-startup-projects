from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_get_types():
    response = client.get("/portfolios/types/all")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
