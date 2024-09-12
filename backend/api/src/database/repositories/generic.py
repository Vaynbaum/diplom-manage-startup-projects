from abc import ABC, abstractmethod
from typing import Generic, List, Optional, TypeVar


T = TypeVar("T")


class GenericRepository(Generic[T], ABC):
    @abstractmethod
    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[T]:
        """Получение всех элементов

        Args:
            offset (int): Смешение
            limit (int): Ограничение количества элементов

        Raises:
            GetAllItemsException: Ошибка получения всех элементов

        Returns:
            List[T]: Список полученных элементов
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_one(self, **filters) -> Optional[T]:
        """Получение одного элемента с фильтрацией

        Raises:
            GetOneItemException: Ошибка получения элемента

        Returns:
            Optional[T]: Один элемент, который может быть None
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[T]:
        """Получение элемента по id

        Args:
            id (int): id элемента

        Raises:
            GetItemByIdException: Ошибка получения элемента по id

        Returns:
            Optional[T]: Один элемент, который может быть None
        """
        raise NotImplementedError()

    @abstractmethod
    async def add(self, record: T) -> T:
        """Добавление элемента в таблицу

        Args:
            record (T): Элемент для добавления

        Raises:
            UniqueViolationException: Ошибка уникальности поля
            ForeignKeyViolationException: Ошибка внешнего ключа
            AddItemException: Ошибка добавления элемента

        Returns:
            T: Элемент добавленный в таблицу
        """
        raise NotImplementedError()

    @abstractmethod
    async def update(self, record: T) -> T:
        """Изменение элемента в таблице

        Args:
            record (T): Элемент для изменения

        Raises:
            UniqueViolationException: Ошибка уникальности поля
            ForeignKeyViolationException: Ошибка внешнего ключа
            UpdateItemException: Ошибка изменения элемента

        Returns:
            T: Элемент измененный в таблице
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, **filters) -> None:
        """Удаление элемента из таблицы

        Args:
            id (int): id элемента

        Raises:
            DeleteItemException: Ошибка удаления элемента
        """
        raise NotImplementedError()
