from app.scoring.baseline_tfidf import TfidfScorer


def test_tfidf_score_range():
	scorer = TfidfScorer()
	score = scorer.score("plants use sunlight", "plants use sunlight to make food")
	assert isinstance(score, float)
	assert 0.0 <= score <= 1.0
