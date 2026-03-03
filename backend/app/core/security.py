import base64
import hashlib
import hmac
import os
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt

from app.core.config import get_settings


settings = get_settings()
PBKDF2_ITERATIONS = 310_000
PBKDF2_ALGORITHM = "sha256"
PBKDF2_KEY_BYTES = 32


def verify_password(plain_password: str, hashed_password: str) -> bool:
	try:
		scheme, iter_s, salt_b64, hash_b64 = hashed_password.split("$", 3)
		if scheme != "pbkdf2_sha256":
			return False
		iterations = int(iter_s)
		salt = base64.b64decode(salt_b64.encode("ascii"))
		expected = base64.b64decode(hash_b64.encode("ascii"))
		derived = hashlib.pbkdf2_hmac(
			PBKDF2_ALGORITHM,
			plain_password.encode("utf-8"),
			salt,
			iterations,
			dklen=len(expected),
		)
		return hmac.compare_digest(derived, expected)
	except Exception:
		return False


def get_password_hash(password: str) -> str:
	salt = os.urandom(16)
	derived = hashlib.pbkdf2_hmac(
		PBKDF2_ALGORITHM,
		password.encode("utf-8"),
		salt,
		PBKDF2_ITERATIONS,
		dklen=PBKDF2_KEY_BYTES,
	)
	salt_b64 = base64.b64encode(salt).decode("ascii")
	hash_b64 = base64.b64encode(derived).decode("ascii")
	return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt_b64}${hash_b64}"


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
