from fastapi import APIRouter
from portal.apps.auth.routes import router as auth_router
from portal.apps.users.routes import router as users_router
from portal.apps.notifications.routes import router as notifications_router
from portal.apps.matching.routes import router as matching_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(users_router, prefix="/users", tags=["Users"])
router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
router.include_router(matching_router, prefix="/matching", tags=["Matching"])
