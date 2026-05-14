from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
	teacher_score: float = Field(ge=0)
	teacher_feedback: str = Field(min_length=1)
