from pydantic import BaseModel, Field


class AssignTaskSchema(BaseModel):
    task_id: int = Field(gt=0)
    user_id: int = Field(gt=0)


class ChangeTaskStatus(BaseModel):
    task_id: int = Field(gt=0)
    status_id: int = Field(gt=0)
