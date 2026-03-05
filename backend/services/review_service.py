from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud.question_crud import get_question_by_id
from crud.review_crud import apply_review, get_answer_by_id
from models.answer import Answer
from utils.validators import validate_teacher_score


def review_answer(
	db: Session,
	answer_id: int,
	teacher_score: float,
	teacher_feedback: str,
) -> Answer:
	answer = get_answer_by_id(db, answer_id)
	if not answer:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")

	question = get_question_by_id(db, answer.question_id)
	if not question:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

	try:
		validate_teacher_score(teacher_score, question.max_score)
	except ValueError as exc:
		raise HTTPException(
			status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
			detail=str(exc),
		) from exc

	return apply_review(
		db=db,
		answer=answer,
		teacher_score=teacher_score,
		teacher_feedback=teacher_feedback,
	)
