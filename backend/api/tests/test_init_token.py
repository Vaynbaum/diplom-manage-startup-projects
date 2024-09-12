import json
from fastapi.testclient import TestClient

from src.main import app
from tests.data import *

client = TestClient(app)


def test_init_token():
    response = client.post(
        "/auth/signin", data={"username": USERNAME, "password": PASSWORD}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)


def test_init_token_admin():
    response = client.post(
        "/auth/signin", data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)


def test_init_refresh_token(refresh_token):
    response = client.get(
        "/auth/refresh_token", headers={"Authorization": f"Bearer {refresh_token}"}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)
