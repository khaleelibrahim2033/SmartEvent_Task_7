import os
import uuid
import qrcode
from pathlib import Path
from app.models.ticket import Ticket

QR_DIR = Path(__file__).resolve().parent / "static" / "qr"
QR_DIR.mkdir(parents=True, exist_ok=True)

def create_ticket(db, booking):
    code = f"SME-{uuid.uuid4().hex[:12].upper()}"
    filename = f"{code}.png"
    filepath = QR_DIR / filename
    qr = qrcode.make(code)
    qr.save(filepath)
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    ticket = Ticket(
        booking_id=booking.id,
        ticket_code=code,
        qr_code_url=f"{base_url}/static/qr/{filename}",
    )
    db.add(ticket)
    return ticket
