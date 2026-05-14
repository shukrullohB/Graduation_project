from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api.deps import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token
from crud.user_crud import authenticate_user, create_user, get_user_by_email
from models.user import User
from schemas.auth import LoginRequest, TokenResponse
from schemas.user import UserCreate, UserPublic
from utils.helpers import normalize_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> User:
	existing = get_user_by_email(db, normalize_email(payload.email))
	if existing:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Email already registered",
		)
	return create_user(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(
	form_data: OAuth2PasswordRequestForm = Depends(),
	db: Session = Depends(get_db),
) -> TokenResponse:
	user = authenticate_user(db, form_data.username, form_data.password)
	if not user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)
	token = create_access_token(subject=user.email)
	return TokenResponse(access_token=token)


@router.post("/login/json", response_model=TokenResponse)
def login_json(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
	user = authenticate_user(db, payload.email, payload.password)
	if not user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)
	token = create_access_token(subject=user.email)
	return TokenResponse(access_token=token)


@router.get("/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)) -> User:
	return current_user
