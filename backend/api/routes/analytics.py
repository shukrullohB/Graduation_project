from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.deps import require_teacher
from app.core.database import get_db
from crud.analytics_crud import get_overview_stats, get_question_stats
from crud.question_crud import get_question_by_id
from models.user import User
from schemas.analytics import AnalyticsOverview, QuestionAnalytics
from services.analytics_service import to_overview_response, to_question_response

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def analytics_overview(
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> AnalyticsOverview:
	stats = get_overview_stats(db)
	return to_overview_response(stats)


@router.get("/questions/{question_id}", response_model=QuestionAnalytics)
def analytics_by_question(
	question_id: int,
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> QuestionAnalytics:
	question = get_question_by_id(db, question_id)
	if not question:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

	stats = get_question_stats(db, question_id)
	return to_question_response(stats)
