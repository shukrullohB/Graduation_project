from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AnswerCreate(BaseModel):
	question_id: int = Field(gt=0)
	answer_text: str = Field(min_length=1)


class AnswerPublic(BaseModel):
	id: int
	question_id: int
	student_id: int
	answer_text: str
	ai_score: float | None
	ai_feedback: str | None
	teacher_score: float | None
	teacher_feedback: str | None
	status: str
	created_at: datetime
	updated_at: datetime

	model_config = ConfigDict(from_attributes=True)

