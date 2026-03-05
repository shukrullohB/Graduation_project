from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
	email: str = Field(min_length=5, max_length=255)
	password: str = Field(min_length=6, max_length=128)


class TokenResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"
