# SmartEvent – Event Discovery & Ticket Booking System

Full-stack project using **FastAPI + React (Vite)**.

## Modules
1. User Authentication – registration, login, bcrypt, JWT, protected routes, profile
2. Event Discovery – event listing, details, category filtering and search
3. Ticket Booking – booking, automatic total calculation, availability validation and history
4. QR Code Ticket System – unique ticket codes, QR generation and verification
5. Event Reminder Notifications – booking notifications, notification list, unread count and mark-as-read
6. Frontend UI – React pages, reusable navigation, Axios integration and protected routes

## Tech Stack
### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite by default / MySQL supported
- Pydantic
- JWT
- bcrypt
- qrcode

### Frontend
- React
- Vite
- Axios
- React Router

## Quick Start

### 1. Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m app.seed
python -m uvicorn main:app --reload
```

Swagger: http://127.0.0.1:8000/docs

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Main User Flow
Register → Login → Browse Events → Search/Filter → Event Details → Select Quantity → Book → Confirmation → QR Ticket → Booking History → Notifications

## Database
Tables:
- users
- events
- bookings
- tickets
- notifications

Relationships:
- One user → many bookings
- One event → many bookings
- One booking → one or more tickets
- One user → many notifications

## Security
- Passwords are stored as bcrypt hashes, never plain text.
- JWT is required for booking, ticket and notification endpoints.
- Booking history and tickets are restricted to the logged-in owner.
- Pydantic validates incoming API data.
- Secrets are loaded from `.env`.

## Important note
This is a development/demo implementation. For production, use a strong secret key, HTTPS, a production database, secure cookie/token strategy, database migrations, rate limiting, and a real background job system for scheduled reminders.
