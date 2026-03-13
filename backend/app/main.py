from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import logging
import time
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.logging import configure_logging
from models import Answer, Question, User
from utils.helpers import parse_cors_origins

settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger("app.request")


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


@app.middleware("http")
async def request_logger(request, call_next):
	request_id = request.headers.get("x-request-id", str(uuid4()))
	start = time.perf_counter()
	try:
		response = await call_next(request)
	except Exception:
		duration_ms = (time.perf_counter() - start) * 1000
		if settings.request_logging_enabled:
			logger.exception(
				"request_id=%s method=%s path=%s status=500 duration_ms=%.2f",
				request_id,
				request.method,
				request.url.path,
				duration_ms,
			)
		raise

	duration_ms = (time.perf_counter() - start) * 1000
	response.headers["X-Request-ID"] = request_id
	if settings.request_logging_enabled:
		logger.info(
			"request_id=%s method=%s path=%s status=%s duration_ms=%.2f",
			request_id,
			request.method,
			request.url.path,
			response.status_code,
			duration_ms,
		)
	return response


@app.get("/")
def root() -> dict[str, str]:
	return {"message": "ASAG Backend API is running"}


@app.get("/health")
def health_check_root() -> dict[str, str]:
	return {"status": "ok", "service": "backend"}
