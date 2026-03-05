from sqlalchemy import select
from sqlalchemy.orm import Session

from models.question import Question
from schemas.question import QuestionCreate


def create_question(db: Session, payload: QuestionCreate, teacher_id: int) -> Question:
	question = Question(
		title=payload.title,
		prompt=payload.prompt,
		reference_answer=payload.reference_answer,
		max_score=payload.max_score,
		created_by=teacher_id,
		is_active=True,
	)
	db.add(question)
	db.commit()
	db.refresh(question)
	return question


def get_question_by_id(db: Session, question_id: int) -> Question | None:
	stmt = select(Question).where(Question.id == question_id)
	return db.scalar(stmt)


def list_questions(db: Session, only_active: bool = True) -> list[Question]:
	stmt = select(Question).order_by(Question.created_at.desc())
	if only_active:
		stmt = stmt.where(Question.is_active.is_(True))
	return list(db.scalars(stmt).all())

