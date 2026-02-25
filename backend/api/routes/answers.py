from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.deps import require_student, require_teacher
from app.core.database import get_db
from crud.answer_crud import create_answer, list_answers_by_question, list_answers_by_student
from crud.question_crud import get_question_by_id
from models.user import User
from schemas.answer import AnswerCreate, AnswerPublic

router = APIRouter(prefix="/answers", tags=["answers"])


@router.post("/submit", response_model=AnswerPublic, status_code=status.HTTP_201_CREATED)
def submit_answer(
	payload: AnswerCreate,
	db: Session = Depends(get_db),
	student: User = Depends(require_student),
) -> AnswerPublic:
	question = get_question_by_id(db, payload.question_id)
	if not question or not question.is_active:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
	return create_answer(db, payload, student.id)


@router.get("/my", response_model=list[AnswerPublic])
def my_answers(
	db: Session = Depends(get_db),
	student: User = Depends(require_student),
) -> list[AnswerPublic]:
	return list_answers_by_student(db, student.id)


@router.get("/question/{question_id}", response_model=list[AnswerPublic])
def question_answers(
	question_id: int,
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> list[AnswerPublic]:
	return list_answers_by_question(db, question_id)

