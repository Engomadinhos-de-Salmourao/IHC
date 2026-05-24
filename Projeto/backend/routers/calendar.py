"""
Calendar API
------------
GET    /api/users/{user_email}/events              – list events
POST   /api/users/{user_email}/events              – create event
PUT    /api/users/{user_email}/events/{event_id}   – update event (alarm, etc.)
DELETE /api/users/{user_email}/events/{event_id}   – delete event
PATCH  /api/users/{user_email}/events/{event_id}/alarm – toggle / configure alarm
"""

from fastapi import APIRouter, HTTPException

from database import get_db, row_to_event
from models import (
    CalendarEventCreate,
    CalendarEventUpdate,
    MessageResponse,
)

router = APIRouter(tags=["calendar"])


# ──────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────

def _get_event_or_404(conn, user_email: str, event_id: str) -> dict:
    row = conn.execute(
        "SELECT * FROM calendar_events WHERE id = ? AND user_email = ?",
        (event_id, user_email),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    return row_to_event(row)


# ──────────────────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────────────────

@router.get("/users/{user_email}/events", response_model=list[dict])
def list_events(user_email: str):
    """Return all calendar events for the user."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM calendar_events WHERE user_email = ? ORDER BY day_of_week, start_time",
            (user_email,),
        ).fetchall()
    return [row_to_event(r) for r in rows]


@router.post("/users/{user_email}/events", response_model=dict, status_code=201)
def create_event(user_email: str, event: CalendarEventCreate):
    """Create a new calendar event for the user."""
    with get_db() as conn:
        # Upsert: if same id already exists, replace it
        conn.execute(
            """
            INSERT OR REPLACE INTO calendar_events
              (id, user_email, course_id, title, day_of_week, start_time, end_time,
               type, location, color, alarm_enabled, alarm_minutes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event.id,
                user_email,
                event.courseId,
                event.title,
                event.dayOfWeek,
                event.startTime,
                event.endTime,
                event.type,
                event.location,
                event.color,
                int(event.alarmEnabled),
                event.alarmMinutes,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM calendar_events WHERE id = ?", (event.id,)
        ).fetchone()
    return row_to_event(row)


@router.put("/users/{user_email}/events/{event_id}", response_model=dict)
def update_event(user_email: str, event_id: str, payload: CalendarEventUpdate):
    """Update any field(s) of an existing calendar event."""
    with get_db() as conn:
        _get_event_or_404(conn, user_email, event_id)  # 404 guard

        updates = payload.model_dump(exclude_none=True)
        if not updates:
            raise HTTPException(status_code=400, detail="No fields provided for update")

        # Map camelCase → snake_case column names
        col_map = {
            "title": "title",
            "dayOfWeek": "day_of_week",
            "startTime": "start_time",
            "endTime": "end_time",
            "type": "type",
            "location": "location",
            "color": "color",
            "alarmEnabled": "alarm_enabled",
            "alarmMinutes": "alarm_minutes",
        }

        set_clauses = []
        values = []
        for key, val in updates.items():
            col = col_map.get(key)
            if col:
                set_clauses.append(f"{col} = ?")
                # SQLite stores booleans as integers
                values.append(int(val) if isinstance(val, bool) else val)

        if not set_clauses:
            raise HTTPException(status_code=400, detail="No valid fields provided")

        values.extend([event_id, user_email])
        conn.execute(
            f"UPDATE calendar_events SET {', '.join(set_clauses)} WHERE id = ? AND user_email = ?",
            values,
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM calendar_events WHERE id = ?", (event_id,)
        ).fetchone()
    return row_to_event(row)


@router.delete("/users/{user_email}/events/{event_id}", response_model=MessageResponse)
def delete_event(user_email: str, event_id: str):
    """Delete a calendar event."""
    with get_db() as conn:
        _get_event_or_404(conn, user_email, event_id)
        conn.execute(
            "DELETE FROM calendar_events WHERE id = ? AND user_email = ?",
            (event_id, user_email),
        )
        conn.commit()
    return MessageResponse(message="Event deleted successfully")


@router.patch("/users/{user_email}/events/{event_id}/alarm", response_model=dict)
def update_alarm(
    user_email: str,
    event_id: str,
    alarm_enabled: bool,
    alarm_minutes: int = 30,
):
    """
    Convenience endpoint: toggle or reconfigure the alarm for an event.
    Usage: PATCH /api/users/{email}/events/{id}/alarm?alarm_enabled=true&alarm_minutes=15
    """
    with get_db() as conn:
        _get_event_or_404(conn, user_email, event_id)
        conn.execute(
            """
            UPDATE calendar_events
               SET alarm_enabled = ?, alarm_minutes = ?
             WHERE id = ? AND user_email = ?
            """,
            (int(alarm_enabled), alarm_minutes, event_id, user_email),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM calendar_events WHERE id = ?", (event_id,)
        ).fetchone()
    return row_to_event(row)