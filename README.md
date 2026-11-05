# TripSync AI ✈️🌍

> **Plan Together. Travel Smarter. Explore Better.**

TripSync AI is an intelligent, autonomous, real-time collaborative travel planning and optimization platform. It combines autonomous multi-agent AI workflows, predictive budget analytics, OR-Tools route optimization, travel risk prediction, machine learning expense anomaly detection, and offline-first Progressive Web App capabilities into a unified commercial SaaS travel ecosystem.

---

## 🏛️ Architecture Overview

TripSync AI employs a microservice architecture composed of three core services:

```
                  ┌──────────────────────────────────────────┐
                  │             Vite + React UI              │
                  │   Tailwind CSS, Lucide, Recharts, PWA   │
                  └────────────────────┬─────────────────────┘
                                       │
                        HTTP REST / WebSockets (Socket.IO)
                                       │
                  ┌────────────────────▼─────────────────────┐
                  │          Node.js Express Gateway         │
                  │      Auth (JWT), Trips, Sockets, Collab  │
                  └──────────┬───────────────────┬───────────┘
                             │                   │
                 Mongoose / MongoDB       REST (Internal IPC)
                             │                   │
                  ┌──────────▼──────────┐ ┌──────▼───────────────────┐
                  │   MongoDB Database  │ │    Python FastAPI AI     │
                  │ Users, Trips, Votes │ │  Autonomous Agents, ML,  │
                  │  Expenses, Reports  │ │  OR-Tools, Risk & Budget │
                  └─────────────────────┘ └──────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (v6.0+)

### 1. Backend Service
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Python AI Microservice
```bash
cd ai-service
# On Windows:
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Running on http://localhost:8000
```

### 3. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🛡️ License & Author
TripSync AI Platform. Designed for commercial-grade real-time collaboration.
