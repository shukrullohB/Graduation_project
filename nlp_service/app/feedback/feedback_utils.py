def clamp_score(score, min_value=0.0, max_value=1.0):
	try:
		value = float(score)
	except (TypeError, ValueError):
		return min_value

	if value < min_value:
		return min_value
	if value > max_value:
		return max_value
	return value


def score_to_band(score):
	if score >= 0.85:
		return "excellent"
	if score >= 0.7:
		return "good"
	if score >= 0.5:
		return "fair"
	return "poor"
