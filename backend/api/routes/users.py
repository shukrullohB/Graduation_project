from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from api.deps import require_teacher
from app.core.database import get_db
from crud.user_crud import list_users
from models.user import User, UserRole
from schemas.user import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserPublic])
def list_users_endpoint(
	role: str | None = Query(default=None, pattern="^(teacher|student)$"),
	db: Session = Depends(get_db),
	_: User = Depends(require_teacher),
) -> list[UserPublic]:
	role_filter = UserRole(role) if role else None
	return list_users(db, role=role_filter)
