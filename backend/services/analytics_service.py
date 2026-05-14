from crud.analytics_crud import OverviewStats, QuestionStats
from schemas.analytics import AnalyticsOverview, QuestionAnalytics


def to_overview_response(stats: OverviewStats) -> AnalyticsOverview:
	review_coverage = (
		(stats.total_reviewed_answers / stats.total_answers) * 100
		if stats.total_answers > 0
		else 0.0
	)
	return AnalyticsOverview(
		total_users=stats.total_users,
		total_teachers=stats.total_teachers,
		total_students=stats.total_students,
		total_questions=stats.total_questions,
		total_answers=stats.total_answers,
		total_reviewed_answers=stats.total_reviewed_answers,
		review_coverage_percent=round(review_coverage, 2),
		avg_ai_score=round(stats.avg_ai_score, 2) if stats.avg_ai_score is not None else None,
		avg_teacher_score=round(stats.avg_teacher_score, 2)
		if stats.avg_teacher_score is not None
		else None,
	)


def to_question_response(stats: QuestionStats) -> QuestionAnalytics:
	review_coverage = (
		(stats.reviewed_answers / stats.total_answers) * 100
		if stats.total_answers > 0
		else 0.0
	)
	return QuestionAnalytics(
		question_id=stats.question_id,
		total_answers=stats.total_answers,
		reviewed_answers=stats.reviewed_answers,
		review_coverage_percent=round(review_coverage, 2),
		avg_ai_score=round(stats.avg_ai_score, 2) if stats.avg_ai_score is not None else None,
		avg_teacher_score=round(stats.avg_teacher_score, 2)
		if stats.avg_teacher_score is not None
		else None,
	)
