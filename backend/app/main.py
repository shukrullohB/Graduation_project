from fastapi import FastAPI

from api.router import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from models import Answer, Question, User

settings = get_settings()

app = FastAPI(
	title=settings.project_name,
	debug=settings.debug,
	version="0.1.0",
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.on_event("startup")
def on_startup() -> None:
	_ = (User, Question, Answer)
	Base.metadata.create_all(bind=engine)


@app.get("/")
def root() -> dict[str, str]:
	return {"message": "ASAG Backend API is running"}
