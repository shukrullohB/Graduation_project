from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models.answer import Answer, AnswerStatus
from models.question import Question
from models.user import User, UserRole


@dataclass
class OverviewStats:
	total_users: int
	total_teachers: int
	total_students: int
	total_questions: int
	total_answers: int
	total_reviewed_answers: int
	avg_ai_score: float | None
	avg_teacher_score: float | None


@dataclass
class QuestionStats:
	question_id: int
	total_answers: int
	reviewed_answers: int
	avg_ai_score: float | None
	avg_teacher_score: float | None


def _to_int(value: int | None) -> int:
	return int(value or 0)


def get_overview_stats(db: Session) -> OverviewStats:
	total_users = _to_int(db.scalar(select(func.count(User.id))))
	total_teachers = _to_int(
		db.scalar(select(func.count(User.id)).where(User.role == UserRole.teacher)),
	)
	total_students = _to_int(
		db.scalar(select(func.count(User.id)).where(User.role == UserRole.student)),
	)
	total_questions = _to_int(db.scalar(select(func.count(Question.id))))
	total_answers = _to_int(db.scalar(select(func.count(Answer.id))))
	total_reviewed_answers = _to_int(
		db.scalar(select(func.count(Answer.id)).where(Answer.status == AnswerStatus.reviewed)),
	)
	avg_ai_score = db.scalar(select(func.avg(Answer.ai_score)))
	avg_teacher_score = db.scalar(select(func.avg(Answer.teacher_score)))

	return OverviewStats(
		total_users=total_users,
		total_teachers=total_teachers,
		total_students=total_students,
		total_questions=total_questions,
		total_answers=total_answers,
		total_reviewed_answers=total_reviewed_answers,
		avg_ai_score=float(avg_ai_score) if avg_ai_score is not None else None,
		avg_teacher_score=float(avg_teacher_score) if avg_teacher_score is not None else None,
	)


def get_question_stats(db: Session, question_id: int) -> QuestionStats:
	total_answers = _to_int(
		db.scalar(select(func.count(Answer.id)).where(Answer.question_id == question_id)),
	)
	reviewed_answers = _to_int(
		db.scalar(
			select(func.count(Answer.id)).where(
				Answer.question_id == question_id,
				Answer.status == AnswerStatus.reviewed,
			),
		),
	)
	avg_ai_score = db.scalar(
		select(func.avg(Answer.ai_score)).where(Answer.question_id == question_id),
	)
	avg_teacher_score = db.scalar(
		select(func.avg(Answer.teacher_score)).where(Answer.question_id == question_id),
	)

	return QuestionStats(
		question_id=question_id,
		total_answers=total_answers,
		reviewed_answers=reviewed_answers,
		avg_ai_score=float(avg_ai_score) if avg_ai_score is not None else None,
		avg_teacher_score=float(avg_teacher_score) if avg_teacher_score is not None else None,
	)
