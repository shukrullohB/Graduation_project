from sqlalchemy import select
from sqlalchemy.orm import Session

from models.answer import Answer, AnswerStatus


def get_answer_by_id(db: Session, answer_id: int) -> Answer | None:
	stmt = select(Answer).where(Answer.id == answer_id)
	return db.scalar(stmt)


def list_pending_reviews(db: Session, limit: int = 50) -> list[Answer]:
	stmt = (
		select(Answer)
		.where(Answer.status == AnswerStatus.submitted)
		.order_by(Answer.created_at.asc())
		.limit(limit)
	)
	return list(db.scalars(stmt).all())


def apply_review(
	db: Session,
	answer: Answer,
	teacher_score: float,
	teacher_feedback: str,
) -> Answer:
	answer.teacher_score = teacher_score
	answer.teacher_feedback = teacher_feedback
	answer.status = AnswerStatus.reviewed
	db.commit()
	db.refresh(answer)
	return answer
