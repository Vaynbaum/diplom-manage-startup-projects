from pydantic import BaseModel, Field


class CreateVacancyResponse(BaseModel):
    vacancy_id: int = Field(gt=0)


class CreateVacancyResponseApprove(BaseModel):
    vacancy_id: int = Field(gt=0)
    user_id: int = Field(gt=0)


class CreateGroupInviteShema(BaseModel):
    user_id: int = Field(gt=0)
    group_id: int = Field(gt=0)


class ResponseInviteGroupInviteShema(BaseModel):
    group_id: int = Field(gt=0)
    is_approved: bool
