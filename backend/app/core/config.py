from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	project_name: str = "ASAG Backend API"
	api_v1_prefix: str = "/api/v1"
	environment: str = "development"
	debug: bool = True

	database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/asag_db"

	jwt_secret_key: str = "change_this_in_production"
	jwt_algorithm: str = "HS256"
	access_token_expire_minutes: int = 120

	nlp_service_base_url: str = "http://localhost:8001"

	model_config = SettingsConfigDict(
		env_file=".env",
		env_file_encoding="utf-8",
		case_sensitive=False,
	)


@lru_cache
def get_settings() -> Settings:
	return Settings()
