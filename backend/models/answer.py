import enum
from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AnswerStatus(str, enum.Enum):
	submitted = "submitted"
	reviewed = "reviewed"


class Answer(Base):
	__tablename__ = "answers"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), nullable=False, index=True)
	student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
	answer_text: Mapped[str] = mapped_column(Text, nullable=False)

	ai_score: Mapped[float | None] = mapped_column(nullable=True)
	ai_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

	teacher_score: Mapped[float | None] = mapped_column(nullable=True)
	teacher_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

	status: Mapped[AnswerStatus] = mapped_column(Enum(AnswerStatus), default=AnswerStatus.submitted, nullable=False)

	created_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		default=lambda: datetime.now(UTC),
		nullable=False,
	)
	updated_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		default=lambda: datetime.now(UTC),
		onupdate=lambda: datetime.now(UTC),
		nullable=False,
	)

