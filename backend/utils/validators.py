def validate_teacher_score(teacher_score: float, max_score: int) -> None:
	if teacher_score < 0:
		raise ValueError("teacher_score must be >= 0")
	if teacher_score > max_score:
		raise ValueError(f"teacher_score cannot exceed question max_score ({max_score})")
