from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.deps import require_teacher
from app.core.database import get_db
from crud.question_crud import create_question, get_question_by_id, list_questions
from models.user import User
from schemas.question import QuestionCreate, QuestionPublic

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("", response_model=QuestionPublic, status_code=status.HTTP_201_CREATED)
def create_question_endpoint(
	payload: QuestionCreate,
	db: Session = Depends(get_db),
	teacher: User = Depends(require_teacher),
) -> QuestionPublic:
	return create_question(db, payload, teacher.id)


@router.get("", response_model=list[QuestionPublic])
def list_questions_endpoint(db: Session = Depends(get_db)) -> list[QuestionPublic]:
	return list_questions(db, only_active=True)


@router.get("/{question_id}", response_model=QuestionPublic)
def get_question_endpoint(question_id: int, db: Session = Depends(get_db)) -> QuestionPublic:
	question = get_question_by_id(db, question_id)
	if not question:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
	return question

