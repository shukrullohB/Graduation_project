from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
	full_name: str = Field(min_length=2, max_length=255)
	email: str = Field(min_length=5, max_length=255)
	role: Literal["teacher", "student"]


class UserCreate(UserBase):
	password: str = Field(min_length=6, max_length=128)


class UserPublic(UserBase):
	id: int
	is_active: bool
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)
