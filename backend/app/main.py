from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from models import Answer, Question, User
from utils.helpers import parse_cors_origins

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
	_ = (User, Question, Answer)
	if settings.auto_create_tables:
		Base.metadata.create_all(bind=engine)
	yield


app = FastAPI(
	title=settings.project_name,
	debug=settings.debug,
	version="0.1.0",
	lifespan=lifespan,
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=parse_cors_origins(settings.backend_cors_origins),
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
def root() -> dict[str, str]:
	return {"message": "ASAG Backend API is running"}


@app.get("/health")
def health_check_root() -> dict[str, str]:
	return {"status": "ok", "service": "backend"}
