from collections.abc import Generator
import os
from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
	sys.path.insert(0, str(BACKEND_DIR))

# Stabilize settings for test process before app imports.
os.environ["DEBUG"] = "true"
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key"

from app.core.database import Base, get_db
from app.main import app


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
	engine = create_engine(
		"sqlite+pysqlite:///:memory:",
		connect_args={"check_same_thread": False},
		poolclass=StaticPool,
	)
	TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

	Base.metadata.create_all(bind=engine)
	session = TestingSessionLocal()
	try:
		yield session
	finally:
		session.close()
		Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
	def override_get_db() -> Generator[Session, None, None]:
		yield db_session

	app.dependency_overrides[get_db] = override_get_db
	app.router.on_startup.clear()
	with TestClient(app) as test_client:
		yield test_client
	app.dependency_overrides.clear()
