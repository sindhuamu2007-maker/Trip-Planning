@echo off
echo ===============================================================
echo             Starting TripSync AI Microservices Ecosystem
echo ===============================================================
echo.

echo [1/3] Starting Python FastAPI AI Microservice (Port 8000)...
start "TripSync AI Service (FastAPI)" cmd /k "cd /d ai-service && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting Node.js Express Backend Service (Port 5000)...
start "TripSync Backend (Express)" cmd /k "cd /d backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting React + Vite Frontend UI (Port 5173)...
start "TripSync Frontend (Vite)" cmd /k "cd /d frontend && npm run dev"

echo.
echo ===============================================================
echo TripSync AI is launching!
echo - Frontend:   http://localhost:5173
echo - Backend:    http://localhost:5000/api/health
echo - AI Service: http://localhost:8000/health
echo ===============================================================
pause
