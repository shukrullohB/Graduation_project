from fastapi import APIRouter

from api.routes.auth import router as auth_router
from api.routes.analytics import router as analytics_router
from api.routes.answers import router as answers_router
from api.routes.health import router as health_router
from api.routes.questions import router as questions_router
from api.routes.reviews import router as reviews_router
from api.routes.users import router as users_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(analytics_router)
api_router.include_router(questions_router)
api_router.include_router(answers_router)
api_router.include_router(reviews_router)
api_router.include_router(users_router)
