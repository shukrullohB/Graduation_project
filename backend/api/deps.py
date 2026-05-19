from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from crud.user_crud import get_user_by_email
from models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
	token: str = Depends(oauth2_scheme),
	db: Session = Depends(get_db),
) -> User:
	payload = decode_access_token(token)
	if not payload or "sub" not in payload:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid authentication token",
		)

	email = str(payload["sub"]).lower().strip()
	user = get_user_by_email(db, email)
	if not user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="User not found",
		)
	return user


def require_teacher(current_user: User = Depends(get_current_user)) -> User:
	if current_user.role != UserRole.teacher:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Teacher role required",
		)
	return current_user


def require_student(current_user: User = Depends(get_current_user)) -> User:
	if current_user.role != UserRole.student:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Student role required",
		)
	return current_user
