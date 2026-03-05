from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from models.user import User, UserRole
from schemas.user import UserCreate
from utils.helpers import normalize_email


def get_user_by_email(db: Session, email: str) -> User | None:
	stmt = select(User).where(User.email == normalize_email(email))
	return db.scalar(stmt)


def create_user(db: Session, payload: UserCreate) -> User:
	user = User(
		full_name=payload.full_name,
		email=normalize_email(payload.email),
		hashed_password=get_password_hash(payload.password),
		role=UserRole(payload.role),
		is_active=True,
	)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
	user = get_user_by_email(db, normalize_email(email))
	if not user:
		return None
	if not verify_password(password, user.hashed_password):
		return None
	if not user.is_active:
		return None
	return user


def list_users(db: Session, role: UserRole | None = None) -> list[User]:
	stmt = select(User).order_by(User.created_at.desc())
	if role is not None:
		stmt = stmt.where(User.role == role)
	return list(db.scalars(stmt).all())
