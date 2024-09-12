from src.other.schemas import *
from src.database.models import *
from src.common.mappers import SimpleDBMapper


class CityDBMapper(SimpleDBMapper[City, CitySchema]):
    def __init__(self):
        super().__init__(CitySchema)


class RegionDBMapper(SimpleDBMapper[Region, RegionSchema]):
    def __init__(self):
        super().__init__(RegionSchema)


class ContactDBMapper(SimpleDBMapper[Contact, ContactSchema]):
    def __init__(self):
        super().__init__(ContactSchema)
