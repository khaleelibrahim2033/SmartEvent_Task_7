from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class EventCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str
    category: str
    location: str
    event_date: datetime
    ticket_price: Decimal = Field(gt=0)
    total_tickets: int = Field(gt=0, le=100000)
    banner_image: str | None = None

class EventResponse(EventCreate):
    id: int
    available_tickets: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
