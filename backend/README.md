# SmartEvent Backend

FastAPI backend for the SmartEvent Event Discovery & Ticket Booking System.

## Features
- User registration and login
- bcrypt password hashing
- JWT authentication
- User profile
- Event discovery, search and category filtering
- Ticket booking and availability validation
- Booking history
- QR ticket generation
- Ticket verification
- Booking notifications
- Unread notification count and mark-as-read

## Run
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m app.seed
python -m uvicorn main:app --reload
```

Swagger: http://127.0.0.1:8000/docs

The default database is SQLite for easy setup. For MySQL, set DATABASE_URL in `.env`.
