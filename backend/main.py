import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import auth, events, bookings, tickets, notifications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartEvent API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("app/static/qr", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(bookings.router)
app.include_router(tickets.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "Welcome to SmartEvent API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
