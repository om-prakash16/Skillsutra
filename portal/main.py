from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from portal.api.v1.router import router as v1_router
from portal.middleware.error_handler import global_exception_handler
from portal.middleware.rate_limit import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from portal.events.consumer import start_event_consumers

app = FastAPI(
    title="Best Hiring Tool Portal",
    description="Professional SaaS Portal for AI-driven hiring and identity proof.",
    version="2.0.0"
)

# Setup Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup Global Error Handling
app.add_exception_handler(Exception, global_exception_handler)

# Start Event Consumers
start_event_consumers()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Versioning
app.include_router(v1_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to the Best Hiring Tool Enterprise Portal API",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("portal.main:app", host="0.0.0.0", port=8000, reload=True)
