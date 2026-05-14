from app.feedback.feedback_utils import clamp_score, score_to_band
from app.feedback.rule_based import generate_feedback


def test_clamp_score_bounds():
	assert clamp_score(-1.0) == 0.0
	assert clamp_score(0.5) == 0.5
	assert clamp_score(2.0) == 1.0


def test_score_to_band_ranges():
	assert score_to_band(0.9) == "excellent"
	assert score_to_band(0.8) == "good"
	assert score_to_band(0.6) == "fair"
	assert score_to_band(0.2) == "poor"


def test_generate_feedback_returns_text():
	text = generate_feedback(2.0, max_score=3.0)
	assert isinstance(text, str)
	assert len(text) > 0
