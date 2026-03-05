from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class QuestionCreate(BaseModel):
	title: str = Field(min_length=3, max_length=255)
	prompt: str = Field(min_length=3)
	reference_answer: str | None = None
	max_score: int = Field(default=5, ge=1, le=10)


class QuestionPublic(BaseModel):
	id: int
	title: str
	prompt: str
	reference_answer: str | None
	max_score: int
	created_by: int
	is_active: bool
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)

