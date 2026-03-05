from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from api.deps import require_teacher
from app.core.database import get_db
from crud.review_crud import list_pending_reviews
from models.user import User
from schemas.answer import AnswerPublic
from schemas.review import ReviewCreate
from services.review_service import review_answer as review_answer_service

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/pending", response_model=list[AnswerPublic])
def pending_reviews(
	limit: int = Query(default=50, ge=1, le=200),
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> list[AnswerPublic]:
	return list_pending_reviews(db, limit=limit)


@router.post("/{answer_id}", response_model=AnswerPublic)
def review_answer(
	answer_id: int,
	payload: ReviewCreate,
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> AnswerPublic:
	return review_answer_service(
		db=db,
		answer_id=answer_id,
		teacher_score=payload.teacher_score,
		teacher_feedback=payload.teacher_feedback,
	)
