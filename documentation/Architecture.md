# TripSync AI – System Architecture Documentation

## 1. Executive Overview

**TripSync AI** is an intelligent, autonomous, real-time collaborative travel planning and optimization platform. It combines autonomous multi-agent AI workflows, predictive budget intelligence, OR-Tools route optimization, travel risk prediction, machine learning expense anomaly detection, and offline-first Progressive Web App capabilities into a unified commercial SaaS travel ecosystem.

Tagline: *"Plan Together. Travel Smarter. Explore Better."*

---

## 2. Microservice Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                           CLIENT TIER (React + Vite PWA)                      |
|                                                                               |
|  - React 18 + Vite (Port 5173)                                                |
|  - Tailwind CSS + Lucide Icons + Recharts Data Visualizations                 |
|  - Service Worker Caching & IndexedDB (Offline Storage)                       |
|  - Socket.IO Client (Real-time Collaboration & Presence)                      |
+------------------------+------------------------------------+-----------------+
                         |                                    |
            REST APIs    |                                    | WebSockets (Real-time)
         (JWT Authorized)|                                    | (Rooms, Presence, Sync)
                         v                                    v
+-------------------------------------------------------------------------------+
|                       API GATEWAY & BACKEND TIER (Node.js Express)             |
|                                                                               |
|  - Express.js HTTP Server & Socket.IO Engine (Port 5000)                      |
|  - Security: Helmet, CORS, Express-Rate-Limit, JWT Auth, bcrypt password hash |
|  - Modules: Trips, Shared Itineraries, Expenses, Voting, Chat, Notifications  |
|  - Optimistic Concurrency Control (Version tracking on Itineraries)           |
+------------------------+------------------------------------+-----------------+
                         |                                    |
          Internal REST  |                                    | Mongoose ODM
             IPC Calls   |                                    | (TCP 27017)
                         v                                    v
+----------------------------------+        +-----------------------------------+
|      AI MICROSERVICE TIER        |        |          DATABASE TIER            |
|       (Python FastAPI)           |        |          (MongoDB 8.2)            |
|                                  |        |                                   |
| - FastAPI Engine (Port 8000)     |        | - Multi-tenant Travel Documents   |
| - Autonomous Multi-Agent Core    |        | - Indexes on User, Trip, Itinerary|
| - Predictive Budget Engine       |        | - Real-time Voting & Chat Records |
| - OR-Tools Route Optimizer       |        | - Historical Expense Repositories |
| - Isolation Forest Anomaly ML    |        |                                   |
| - Travel Risk & Weather Engine   |        |                                   |
| - Carbon Footprint Calculator    |        |                                   |
+----------------------------------+        +-----------------------------------+
```

---

## 3. Communication Protocols

1. **Frontend ⟷ Backend (HTTP REST & WebSocket)**:
   - REST endpoints at `/api/v1/*` handling authentication, trip CRUD, profile, and voting.
   - Socket.IO at `ws://localhost:5000` handling live room presence, shared itinerary edits, and real-time chat.
   - Vite dev server reverse-proxies `/api` and `/socket.io` to port 5000.

2. **Backend ⟷ AI Microservice (Internal HTTP IPC)**:
   - Backend communicates with `http://127.0.0.1:8000/api/v1/*` using Axios.
   - Pydantic models validate incoming and outgoing schemas with strict data typing.
   - Fallback mock intelligence is provided when external AI provider keys are not supplied.

3. **Backend ⟷ MongoDB**:
   - High-throughput Mongoose connection pool to `mongodb://127.0.0.1:27017/tripsync`.
   - Automatic reconnect and graceful degraded mode handling.

---

## 4. Port Allocations & Endpoints

| Service | Port | Primary URL | Health Check Endpoint |
|---|---|---|---|
| Frontend (React + Vite) | 5173 | `http://localhost:5173` | `/` |
| Backend (Node.js Express) | 5000 | `http://localhost:5000` | `http://localhost:5000/api/health` |
| AI Service (Python FastAPI) | 8000 | `http://127.0.0.1:8000` | `http://127.0.0.1:8000/health` |
| Database (MongoDB Server) | 27017 | `mongodb://127.0.0.1:27017` | Standard Wire Protocol |

---

## 5. Security & Isolation Guidelines

- Environment variables isolate secrets in `.env` files across both `backend/` and `ai-service/`.
- Never expose API keys or credentials to the client bundle.
- Passwords are encrypted using salted `bcryptjs` hashing.
- JSON Web Tokens (JWT) guard all protected endpoints.
- Rate limiting prevents denial-of-service abuse.
