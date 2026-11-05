# TripSync AI ✈️🌍

> **Plan together. Travel smarter. Explore better.**

TripSync AI is a collaborative travel-planning web application for organizing trips, building itineraries, and keeping group travel details in one place. Users can plan a trip, explore destination suggestions, manage a shared budget, record expenses, and coordinate plans with other travelers.

The application uses a React frontend, a Node.js and Express API, MongoDB, and a Python FastAPI service for itinerary planning.

## Features

- **Trip planning:** Create trips with a destination, dates or duration, budget, traveler count, travel style, and interests.
- **Itinerary planning:** Build a day-by-day itinerary with suggested attractions, dining, and activities.
- **Group collaboration:** Invite or join trips and coordinate plans with other travelers.
- **Group voting:** Share options and use real-time vote updates to help make group decisions.
- **Budget and expenses:** View a trip budget breakdown and record trip expenses.
- **Destination information:** Explore curated destination suggestions, estimated route information, and weather or travel-risk summaries.
- **Authentication:** Register and sign in to manage trips associated with your account.

> **Data note:** Destination recommendations, weather summaries, and route estimates may be curated or illustrative rather than live data. Verify current prices, opening hours, weather, and travel advisories before making bookings or travel decisions.

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Recharts |
| Backend API | Node.js, Express |
| Database | MongoDB, Mongoose |
| Real-time communication | Socket.IO |
| AI planning service | Python, FastAPI |
| Authentication | JSON Web Tokens (JWT), bcrypt |

## Architecture

```text
┌──────────────────────┐
│ React + Vite frontend│
└──────────┬───────────┘
           │ REST API / Socket.IO
┌──────────▼───────────┐
│ Node.js + Express API│
└───────┬────────┬─────┘
        │        │ Internal HTTP requests
┌───────▼─────┐  └──────────────┐
│  MongoDB    │         ┌───────▼────────┐
│ trip data   │         │ Python FastAPI │
└─────────────┘         │ planning API   │
                        └────────────────┘
```

## Project structure

```text
TripSync-AI/
├── ai-service/       # Python FastAPI planning service
├── backend/          # Express API, MongoDB models, and Socket.IO
├── frontend/         # React and Vite application
├── documentation/    # Project documentation
├── docker-compose.yml
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18 or later
- Python 3.10 or later
- MongoDB 6 or later, running locally or through Docker

### 1. Configure the backend

From the project root:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` and set your local MongoDB connection string and a unique, secure `JWT_SECRET`. Do not commit `.env` files or share secret values.

### 2. Start MongoDB

Start your local MongoDB server, or use the included Docker Compose configuration:

```powershell
docker compose up -d mongodb
```

### 3. Start the backend API

In a terminal:

```powershell
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Start the Python planning service

In a second terminal:

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The FastAPI service runs at `http://localhost:8000`. Its interactive API documentation is available at `http://localhost:8000/docs`.

### 5. Start the frontend

In a third terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Run with Docker Compose

If Docker is installed, you can start the configured services with:

```powershell
docker compose up --build
```

To stop the services:

```powershell
docker compose down
```

## API overview

The backend API is served from `http://localhost:5000`.

| Endpoint | Purpose |
|---|---|
| `/health` | Check whether the backend is running |
| `/api/health` | Check backend, database, and AI-service status |
| `/api/v1/auth/register` | Register an account |
| `/api/v1/auth/login` | Sign in |
| `/api/v1/auth/me` | Get the current authenticated user |
| `/api/v1/trips` | List or create trips |
| `/api/v1/trips/:id` | Get or manage a trip |
| `/api/v1/ai/plan-trip` | Request a proposed trip plan |
| `/api/v1/hotels` | Access hotel-related data |

Some endpoints require an authenticated user. See the backend route files for request and response details.

## Development

Run the backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

## Security

- Keep credentials and API keys in local environment files.
- Use a strong, unique `JWT_SECRET` for your environment.
- Never commit `.env` files, passwords, or production secrets.
- Check external travel information with current, authoritative sources before relying on it.

## License

No license has been specified yet. Add a `LICENSE` file if you want to define how others may use, modify, or distribute this project.
