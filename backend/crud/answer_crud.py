from sqlalchemy import select
from sqlalchemy.orm import Session

from models.answer import Answer, AnswerStatus
from schemas.answer import AnswerCreate


def create_answer(db: Session, payload: AnswerCreate, student_id: int) -> Answer:
	answer = Answer(
		question_id=payload.question_id,
		student_id=student_id,
		answer_text=payload.answer_text,
		status=AnswerStatus.submitted,
	)
	db.add(answer)
	db.commit()
	db.refresh(answer)
	return answer


def list_answers_by_student(db: Session, student_id: int) -> list[Answer]:
	stmt = (
		select(Answer)
		.where(Answer.student_id == student_id)
		.order_by(Answer.created_at.desc())
	)
	return list(db.scalars(stmt).all())


def list_answers_by_question(db: Session, question_id: int) -> list[Answer]:
	stmt = (
		select(Answer)
		.where(Answer.question_id == question_id)
		.order_by(Answer.created_at.desc())
	)
	return list(db.scalars(stmt).all())

