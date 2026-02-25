from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.deps import require_student, require_teacher
from app.core.database import get_db
from crud.answer_crud import create_answer, list_answers_by_question, list_answers_by_student
from services.scoring_client import score_answer, ScoringError
from crud.question_crud import get_question_by_id
from models.user import User
from schemas.answer import AnswerCreate, AnswerPublic

router = APIRouter(prefix="/answers", tags=["answers"])



from fastapi import BackgroundTasks
import asyncio

@router.post("/submit", response_model=AnswerPublic, status_code=status.HTTP_201_CREATED)
async def submit_answer(
	payload: AnswerCreate,
	db: Session = Depends(get_db),
	student: User = Depends(require_student),
) -> AnswerPublic:
	question = get_question_by_id(db, payload.question_id)
	if not question or not question.is_active:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

	# Call NLP scoring service
	try:
		ai_score, ai_feedback = await score_answer(payload.question_id, payload.answer_text)
	except ScoringError as e:
		raise HTTPException(status_code=502, detail=str(e))

	# Save answer with AI results
	answer = create_answer(db, payload, student.id)
	answer.ai_score = ai_score
	answer.ai_feedback = ai_feedback
	db.commit()
	db.refresh(answer)
	return answer


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

