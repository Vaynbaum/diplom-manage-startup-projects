import json
import pytest

from tests.data import PATH_2_TOKEN


@pytest.fixture(scope="module")
def access_token():
    with open(PATH_2_TOKEN) as json_file:
        data = json.load(json_file)
    return data["access_token"]

