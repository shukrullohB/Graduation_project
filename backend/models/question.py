from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Question(Base):
	__tablename__ = "questions"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	title: Mapped[str] = mapped_column(String(255), nullable=False)
	prompt: Mapped[str] = mapped_column(Text, nullable=False)
	reference_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
	max_score: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
	created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
	is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
	created_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		default=lambda: datetime.now(UTC),
		nullable=False,
	)

