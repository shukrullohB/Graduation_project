import logging

import httpx

from app.core.config import get_settings
from schemas.question import QuestionAISuggestRequest, QuestionAISuggestResponse

settings = get_settings()
logger = logging.getLogger("app.question_ai")


class QuestionAIError(Exception):
	pass


async def suggest_question_draft(payload: QuestionAISuggestRequest) -> QuestionAISuggestResponse:
	"""
	Call NLP service to generate a teacher-friendly question draft.
	Returns title, prompt, reference_answer and max_score.
	"""
	url = f"{settings.nlp_service_base_url}/generate-question"
	try:
		async with httpx.AsyncClient(timeout=12) as client:
			resp = await client.post(url, json=payload.model_dump())
			resp.raise_for_status()
			data = resp.json()
			return QuestionAISuggestResponse(**data)
	except Exception as e:
		logger.warning("question draft generation failed: %s", e)
		raise QuestionAIError(f"Question generation failed: {e}")
