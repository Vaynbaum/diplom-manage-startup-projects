from pydantic import BaseModel


class NoteInputSchema(BaseModel):
    text: str
    user_id: int
