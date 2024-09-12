from src.other.phrases import *
from src.other.mappers import *
from src.common.exceptions import AnyServiceException
from src.database.exceptions import GetAllItemsException
from src.common.services.unit_of_work import IUnitOfWork
from src.common.utils import process_items_from_db


class OtherService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_cities(
        self, l: int, o: int, substr: str | None, region_id: int | None
    ):
        async with self.__uow:
            try:
                cities = await self.__uow.cities.get_all(l, o, substr, region_id)
                m = CityDBMapper()
                return process_items_from_db(cities, CITIES_404, m, offset=o)
            except GetAllItemsException as e:
                raise AnyServiceException(CITIES_EXCEPTION) from e

    async def get_all_regions(self, l: int, o: int, substr: str | None):
        async with self.__uow:
            try:
                regions = await self.__uow.regions.get_all(l, o, substr)
                m = RegionDBMapper()
                return process_items_from_db(regions, REGIONS_404, m, offset=o)
            except GetAllItemsException as e:
                raise AnyServiceException(REGIONS_EXCEPTION) from e

    async def get_all_contacts(self):
        async with self.__uow:
            try:
                contacts = await self.__uow.contacts.get_all()
                m = ContactDBMapper()
                return process_items_from_db(contacts, CONTACTS_404, m, False)
            except GetAllItemsException as e:
                raise AnyServiceException(CONTACTS_EXCEPTION) from e
