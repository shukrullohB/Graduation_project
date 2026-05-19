"""init schema

Revision ID: 20260303_000001
Revises:
Create Date: 2026-03-03
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20260303_000001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
	op.create_table(
		"users",
		sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
		sa.Column("full_name", sa.String(length=255), nullable=False),
		sa.Column("email", sa.String(length=255), nullable=False),
		sa.Column("hashed_password", sa.String(length=255), nullable=False),
		sa.Column("role", sa.Enum("teacher", "student", name="userrole"), nullable=False),
		sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
	)
	op.create_index("ix_users_id", "users", ["id"], unique=False)
	op.create_index("ix_users_email", "users", ["email"], unique=True)

	op.create_table(
		"questions",
		sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
		sa.Column("title", sa.String(length=255), nullable=False),
		sa.Column("prompt", sa.Text(), nullable=False),
		sa.Column("reference_answer", sa.Text(), nullable=True),
		sa.Column("max_score", sa.Integer(), nullable=False, server_default="5"),
		sa.Column("created_by", sa.Integer(), nullable=False),
		sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
		sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
	)
	op.create_index("ix_questions_id", "questions", ["id"], unique=False)
	op.create_index("ix_questions_created_by", "questions", ["created_by"], unique=False)

	op.create_table(
		"answers",
		sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
		sa.Column("question_id", sa.Integer(), nullable=False),
		sa.Column("student_id", sa.Integer(), nullable=False),
		sa.Column("answer_text", sa.Text(), nullable=False),
		sa.Column("ai_score", sa.Float(), nullable=True),
		sa.Column("ai_feedback", sa.Text(), nullable=True),
		sa.Column("teacher_score", sa.Float(), nullable=True),
		sa.Column("teacher_feedback", sa.Text(), nullable=True),
		sa.Column(
			"status",
			sa.Enum("submitted", "reviewed", name="answerstatus"),
			nullable=False,
			server_default="submitted",
		),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
		sa.ForeignKeyConstraint(["question_id"], ["questions.id"]),
		sa.ForeignKeyConstraint(["student_id"], ["users.id"]),
	)
	op.create_index("ix_answers_id", "answers", ["id"], unique=False)
	op.create_index("ix_answers_question_id", "answers", ["question_id"], unique=False)
	op.create_index("ix_answers_student_id", "answers", ["student_id"], unique=False)


def downgrade() -> None:
	op.drop_index("ix_answers_student_id", table_name="answers")
	op.drop_index("ix_answers_question_id", table_name="answers")
	op.drop_index("ix_answers_id", table_name="answers")
	op.drop_table("answers")
	op.execute("DROP TYPE IF EXISTS answerstatus")

	op.drop_index("ix_questions_created_by", table_name="questions")
	op.drop_index("ix_questions_id", table_name="questions")
	op.drop_table("questions")

	op.drop_index("ix_users_email", table_name="users")
	op.drop_index("ix_users_id", table_name="users")
	op.drop_table("users")
	op.execute("DROP TYPE IF EXISTS userrole")
