import httpx
from app.core.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger("app.scoring")

class ScoringError(Exception):
	pass

async def score_answer(question_id: int, answer_text: str) -> tuple[float, str]:
	"""
	Call NLP service to get AI score and feedback for a student's answer.
	Returns (score, feedback).
	Raises ScoringError on failure.
	"""
	url = f"{settings.nlp_service_base_url}/score"
	payload = {"question_id": question_id, "answer_text": answer_text}
	try:
		async with httpx.AsyncClient(timeout=10) as client:
			resp = await client.post(url, json=payload)
			resp.raise_for_status()
			data = resp.json()
			return float(data["score"]), str(data["feedback"])
	except Exception as e:
		logger.warning("nlp scoring failed for question_id=%s: %s", question_id, e)
		raise ScoringError(f"NLP scoring failed: {e}")
