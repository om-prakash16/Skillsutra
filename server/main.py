import time
import uuid
import warnings

# Suppress the deprecation warning for google.generativeai
warnings.filterwarnings("ignore", module="google.generativeai")
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from core.config import settings
from core.logging import ProtocolLogger, setup_logging
from core.exceptions import AppException
from core.response import error_response

# Initialize Logging
setup_logging()
logger = ProtocolLogger.get_logger("main")

from db.engine import init_db

from core.websocket import manager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}...")
    await init_db()
    
    # Start Redis Pub/Sub WebSocket Backplane listener
    redis_task = asyncio.create_task(manager.subscribe_to_redis("chat_broadcasts"))
    # Start WebSocket heartbeat loop to reap ghost connections
    heartbeat_task = asyncio.create_task(manager.heartbeat_loop())
    
    yield
    
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
    redis_task.cancel()
    heartbeat_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SkillSutra — AI-powered talent verification and hiring platform. Replace resumes with Proof Scores.",
    version=settings.PROJECT_VERSION,
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from api.middleware.rate_limit import RateLimitMiddleware
from starlette.middleware.gzip import GZipMiddleware

# (Previous imports...)

# --- Global Middleware ---

@app.middleware("http")
async def add_security_and_tracing_headers(request: Request, call_next):
    """Adds security headers and request tracing (Request ID)."""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    
    return response

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RateLimitMiddleware, limit=100, window=60)
from core.middleware import IdempotencyMiddleware
app.add_middleware(IdempotencyMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://localhost:8000"
    ],
    allow_origin_regex="https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# --- Exception Handlers ---

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    request_id = getattr(request.state, "request_id", None)
    return error_response(
        message=exc.message,
        code=exc.code,
        details=exc.details,
        status_code=exc.status_code,
        request_id=request_id
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = getattr(request.state, "request_id", None)
    return error_response(
        message=str(exc.detail),
        code="http_error",
        status_code=exc.status_code,
        request_id=request_id
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", None)
    return error_response(
        message="Validation Error",
        code="validation_error",
        details=exc.errors(),
        status_code=422,
        request_id=request_id
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"Unhandled Exception [ID: {request_id}]: {str(exc)}", exc_info=True)
    return error_response(
        message="Internal Server Error",
        code="internal_error",
        details={"request_id": request_id} if settings.DEBUG else None,
        status_code=500,
        request_id=request_id
    )

# --- Router Registration ---

from api.v1.router import v1_router

app.include_router(v1_router, prefix=settings.API_V1_STR)

# --- Instrumentation ---
try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app)
    
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    FastAPIInstrumentor.instrument_app(app)
except ImportError:
    pass

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "timestamp": time.time(),
        "version": settings.PROJECT_VERSION
    }

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs" if settings.DEBUG else "Contact admin for access"
    }
