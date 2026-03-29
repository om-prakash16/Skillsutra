from fastapi import FastAPI
from api.ai_routes import router as ai_router

app = FastAPI(
    title="Web3 Talent Marketplace API",
    description="Backend services for the Decentralized SaaS Job Portal",
    version="1.0.0"
)

app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Web3 Talent Marketplace API"}

