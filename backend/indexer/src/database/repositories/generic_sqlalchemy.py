from abc import ABC
from typing import List, Optional, Type, TypeVar
from asyncpg.exceptions import UniqueViolationError, ForeignKeyViolationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, or_, select
from sqlalchemy.sql import Select
from sqlalchemy.sql.selectable import Subquery
from sqlalchemy.exc import IntegrityError

from src.database.repositories.operators_sqlalchemy import *
from src.database.exceptions import *
from src.database.repositories.generic import GenericRepository

T = TypeVar("T")


class GenericSqlRepository(GenericRepository[T], ABC):
    def __init__(self, session: AsyncSession, model_cls: Type[T]) -> None:
        self._session = session
        self._model_cls = model_cls
        self._operators: dict[BaseOperator] = {
            MORE: MoreOperator(),
            MORE_EQUAL: MoreEqualOperator(),
            LESS: LessOperator(),
            LESS_EQUAL: LessEqualOperator(),
            EQUAL: EqualOperator(),
            NOT_EQUAL: NotEqualOperator(),
        }

    async def get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> List[T]:
        stmt = self._construct_statement_get_all(offset, limit, **filters)
        return await self._execute_statement_get_all(stmt)

    async def get_one(self, **filters) -> Optional[T]:
        stmt = self._construct_statement_get_one(**filters)
        return await self._execute_statement_get_one(stmt)

    async def get_by_id(self, id: int) -> Optional[T]:
        stmt = self._construct_statement_get_by_id(id)
        return await self._execute_statement_get_by_id(stmt, id)

    async def add(self, record: T) -> T:
        try:
            self._session.add(record)
            await self._session.flush()
            await self._session.refresh(record)
            return record
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == UniqueViolationError:
                raise UniqueViolationException(e.args[0]) from e
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException(self._model_cls.__name__) from e
            raise AddItemException(self._model_cls.__name__) from e
        except Exception as e:
            raise AddItemException(self._model_cls.__name__) from e

    async def add_all(self, records: list[T]) -> bool:
        try:
            self._session.add_all(records)
            return True
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == UniqueViolationError:
                raise UniqueViolationException(e.args[0])
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException(self._model_cls.__name__)
            raise AddItemException(self._model_cls.__name__)
        except Exception as e:
            raise AddItemException(self._model_cls.__name__)

    async def update(self, record: T) -> T:
        try:
            self._session.add(record)
            await self._session.flush()
            await self._session.refresh(record)
            return record
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == UniqueViolationError:
                raise UniqueViolationException(e.args[0])
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException(self._model_cls.__name__)
            raise UpdateItemException(self._model_cls.__name__)
        except Exception as e:
            raise UpdateItemException(self._model_cls.__name__) from e

    async def delete(self, **filters) -> None:
        try:
            record = await self.get_one(**filters)
            if record is not None:
                await self._session.delete(record)
                await self._session.flush()
                return True
            else:
                return False
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException(self._model_cls.__name__)
            raise DeleteItemException(self._model_cls.__name__)
        except Exception as e:
            raise DeleteItemException(self._model_cls.__name__) from None

    def _add_substr_to_stmt(
        self, stmt: Select, column, substr: str | None, columns: list | None = None
    ) -> Select:
        """Добавление поиска по подстроке

        Args:
            stmt (Select): statement
            column (str): Название столбца
            substr (str): Подстрока

        Returns:
            Select: Собранный statement
        """
        if substr:
            if column:
                return stmt.where(column.ilike(f"%{substr}%"))
            elif columns:
                l = [column.ilike(f"%{substr}%") for column in columns]
                return stmt.where(or_(*l))
        return stmt

    def _construct_statement_get_all(
        self, offset: int | None = None, limit: int | None = None, **filters
    ) -> Select:
        """Конструктор statement для метода получения всех элементов

        Args:
            offset (int | None): Смешение
            limit (int | None): Ограничение количества элементов

        Returns:
            Select: Собранный statement
        """
        stmt = self._construct_list_stmt(**filters)
        stmt = self._add_limit_offset_to_stmt(stmt, limit, offset)
        return stmt

    def _add_limit_offset_to_stmt(
        self, stmt: Select, limit: int | None, offset: int | None
    ):
        if offset and limit:
            stmt = stmt.limit(limit).offset(offset * limit)
        elif limit:
            stmt = stmt.limit(limit)
        return stmt

    def _construct_statement_get_one(self, **filters) -> Select:
        """Конструктор statement для метода получения одного элемента

        Returns:
            Select: Собранный statement
        """
        return self._construct_list_stmt(**filters)

    def _construct_statement_get_by_id(self, id: int) -> Select:
        """Конструктор statement для метода получения одного элемента по id

        Args:
            id (int): id элемента

        Returns:
            Select: Собранный statement
        """
        return self._construct_get_stmt(id)

    def _construct_get_stmt(self, id: int) -> Select:
        """Конструктор statement для получения элемента по id

        Args:
            id (int): id элемента

        Returns:
            Select: Собранный statement
        """
        return select(self._model_cls).where(self._model_cls.id == id)

    def _construct_list_stmt(
        self,
        stmt: Select | None = None,
        table=None,
        operator=EQUAL,
        link=and_,
        **filters,
    ) -> Select:
        """Конструктор statement для получения на основе фильтров

        Raises:
            InvalidColumnException: Неизвестный столбец для фильтрации

        Returns:
            Select: Собранный statement
        """
        model = self._model_cls if table is None else table
        if stmt is None:
            stmt = select(model)
        where_clauses = []
        for column, value in filters.items():
            if value is None:
                continue
            if not hasattr(model, column):
                raise InvalidColumnException(column) from None

            o = self._operators.get(operator, None)
            if not o:
                raise InvalidOpertatorException(operator) from None
            s = o.execute(getattr(model, column), value)
            where_clauses.append(s)

        if len(where_clauses) == 1:
            stmt = stmt.where(where_clauses[0])
        elif len(where_clauses) > 1:
            stmt = stmt.where(link(*where_clauses))
        return stmt

    def _constructor_subquery(
        self, table, join_tables: list = [], **filters
    ) -> Subquery:
        tmp = self._construct_list_stmt(table=table, **filters)
        tmp = self._join_tables(tmp, join_tables)
        return tmp.subquery()

    def _join_tables(self, stmt: Select, tables: list = []):
        for t in tables:
            stmt = stmt.join(t)
        return stmt

    def _filter_table(self, stmt: Select, table, operator=EQUAL, **filters):
        stmt = self._construct_list_stmt(stmt, table, operator, **filters)
        return stmt

    async def _execute_statement_get_all(self, statement: Select) -> List[T]:
        """Выполнения statement для метода получения всех элементов

        Args:
            statement (Select): Собранный statement

        Raises:
            GetAllItemsException: Ошибка получения всех элементов

        Returns:
            List[T]: Список полученных элементов
        """
        try:
            result = await self._session.execute(statement)
            return result.scalars().all()
        except Exception as e:
            print(e)
            raise GetAllItemsException(self._model_cls.__name__) from e

    async def _execute_statement_get_one(self, statement: Select) -> Optional[T]:
        """Выполнения statement для метода получения одного элемента

        Args:
            statement (Select): Собранный statement

        Raises:
            GetOneItemException: Ошибка получения элемента

        Returns:
            Optional[T]: Один элемент, который может быть None
        """
        try:
            result = await self._session.execute(statement)
            return result.scalar()
        except Exception as e:
            raise GetOneItemException(self._model_cls.__name__) from e

    async def _execute_statement_get_by_id(self, statement: Select, id: int):
        """Выполнения statement для метода получения одного элемента

        Args:
            statement (Select): Собранный statement
            id (int): id элемента

        Raises:
            GetItemByIdException: Ошибка получения элемента по id

        Returns:
            Optional[T]: Один элемент, который может быть None
        """
        try:
            result = await self._session.execute(statement)
            return result.scalar()
        except Exception as e:
            raise GetItemByIdException(self._model_cls.__name__, id) from e
