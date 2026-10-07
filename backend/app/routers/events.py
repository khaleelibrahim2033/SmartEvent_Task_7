from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.schemas.event import EventResponse

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("/", response_model=list[EventResponse])
def list_events(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Event)
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))
    if category:
        query = query.filter(Event.category.ilike(category))
    return query.order_by(Event.event_date.asc()).all()

@router.get("/categories")
def categories():
    return {"categories": ["Music", "Tech", "Sports", "Business"]}

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    return event
