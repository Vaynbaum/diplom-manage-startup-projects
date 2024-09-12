from abc import ABC, abstractmethod
from datetime import date, timedelta
from sqlalchemy import Float, Integer

MORE = ">"
MORE_EQUAL = ">="
LESS = "<"
LESS_EQUAL = "<="
EQUAL = "=="
NOT_EQUAL = "!="


class BaseOperator(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def execute(self, left_value, right_value):
        raise NotImplementedError()


class MoreOperator(BaseOperator):
    def __init__(self):
        super().__init__(MORE)

    def execute(self, left_value, right_value):
        return left_value > right_value


class MoreEqualOperator(BaseOperator):
    def __init__(self):
        super().__init__(MORE_EQUAL)

    def execute(self, left_value, right_value):
        return left_value >= right_value


class LessOperator(BaseOperator):
    def __init__(self):
        super().__init__(LESS)

    def execute(self, left_value, right_value):
        return left_value < right_value


class LessEqualOperator(BaseOperator):
    def __init__(self):
        super().__init__(LESS_EQUAL)

    def execute(self, left_value, right_value):
        return left_value <= right_value


class EqualOperator(BaseOperator):
    def __init__(self):
        super().__init__(EQUAL)

    def execute(self, left_value, right_value):
        return left_value == right_value


class NotEqualOperator(BaseOperator):
    def __init__(self):
        super().__init__(NOT_EQUAL)

    def execute(self, left_value, right_value):
        return left_value != right_value


class LessDayAgainOperator(BaseOperator):
    def __init__(self):
        super().__init__("<d")

    def execute(self, left_value, right_value):
        d = date.today() - timedelta(days=right_value)
        return left_value < d


class MoreDayAfterOperator(BaseOperator):
    def __init__(self):
        super().__init__(">d")

    def execute(self, left_value, right_value):
        d = date.today() + timedelta(days=right_value)
        return left_value > d


class EqualDayAgainOperator(BaseOperator):
    def __init__(self):
        super().__init__("==db")

    def execute(self, left_value, right_value):
        d = date.today() - timedelta(days=right_value)
        return left_value == d


class EqualDayAfterOperator(BaseOperator):
    def __init__(self):
        super().__init__("==df")

    def execute(self, left_value, right_value):
        d = date.today() + timedelta(days=right_value)
        return left_value == d


class SubtractionOperator(BaseOperator):
    def __init__(self):
        super().__init__("-")

    def execute(self, left_value, right_value):
        return left_value.cast(Integer) - right_value.cast(Integer)


class AdditionOperator(BaseOperator):
    def __init__(self):
        super().__init__("+")

    def execute(self, left_value, right_value):
        return left_value.cast(Integer) + right_value.cast(Integer)


class MultiplyOperator(BaseOperator):
    def __init__(self):
        super().__init__("*")

    def execute(self, left_value, right_value):
        return left_value.cast(Integer) * right_value.cast(Integer)


class DivisionOperator(BaseOperator):
    def __init__(self):
        super().__init__("/")

    def execute(self, left_value, right_value):
        return left_value.cast(Float) / right_value.cast(Float)
