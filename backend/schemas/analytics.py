from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
	total_users: int
	total_teachers: int
	total_students: int
	total_questions: int
	total_answers: int
	total_reviewed_answers: int
	review_coverage_percent: float
	avg_ai_score: float | None
	avg_teacher_score: float | None


class QuestionAnalytics(BaseModel):
	question_id: int
	total_answers: int
	reviewed_answers: int
	review_coverage_percent: float
	avg_ai_score: float | None
	avg_teacher_score: float | None
