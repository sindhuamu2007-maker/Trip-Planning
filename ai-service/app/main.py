import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="TripSync AI Microservice",
    description="Autonomous AI Agent, Predictive Intelligence, Route Optimization & Risk Analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.ai_router import router as ai_router
app.include_router(ai_router)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

class PingRequest(BaseModel):
    message: str = "ping"

@app.get("/")
def read_root():
    return {
        "service": "TripSync AI Microservice",
        "status": "online",
        "tagline": "Plan Together. Travel Smarter. Explore Better.",
        "capabilities": [
            "Autonomous Multi-Agent Travel Planner",
            "Predictive Budget Intelligence",
            "OR-Tools Route Optimization",
            "Travel Risk & Weather Prediction",
            "Expense Anomaly Detection (Isolation Forest)",
            "Carbon Footprint & Sustainability Estimator"
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "tripsync-ai-microservice",
        "timestamp": time.time(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "mock-key-demo-mode")
    }

@app.post("/api/v1/ping")
def ping_service(req: PingRequest):
    return {
        "reply": f"TripSync AI received: {req.message}",
        "timestamp": time.time(),
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
