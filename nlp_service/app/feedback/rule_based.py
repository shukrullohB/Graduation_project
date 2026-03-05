from app.feedback.feedback_utils import clamp_score, score_to_band
from app.feedback.template_feedback import TEMPLATES


def generate_feedback(score, max_score=1.0):
	if max_score <= 0:
		return TEMPLATES.get("poor", "Feedback not available.")

	clipped = clamp_score(score, 0.0, max_score)
	normalized = clipped / max_score
	band = score_to_band(normalized)
	return TEMPLATES.get(band, "Feedback not available.")
