from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings


settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
	return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
	return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
	expire = datetime.now(UTC) + (
		expires_delta
		if expires_delta is not None
		else timedelta(minutes=settings.access_token_expire_minutes)
	)
	payload = {"sub": subject, "exp": expire}
	return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict | None:
	try:
		return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
	except JWTError:
		return None
