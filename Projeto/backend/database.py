import sqlite3
from contextlib import contextmanager
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "educafree.db"


@contextmanager
def get_db():
    """Yield a SQLite connection with row_factory set to Row."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    """Create tables if they don't exist yet."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS subscriptions (
                user_email  TEXT NOT NULL,
                course_id   TEXT NOT NULL,
                created_at  TEXT NOT NULL DEFAULT (datetime('now')),
                PRIMARY KEY (user_email, course_id)
            );

            CREATE TABLE IF NOT EXISTS calendar_events (
                id              TEXT PRIMARY KEY,
                user_email      TEXT NOT NULL,
                course_id       TEXT,
                title           TEXT NOT NULL,
                day_of_week     INTEGER NOT NULL,
                start_time      TEXT NOT NULL,
                end_time        TEXT NOT NULL,
                type            TEXT DEFAULT 'online',
                location        TEXT DEFAULT 'Online',
                color           TEXT DEFAULT '#3b82f6',
                alarm_enabled   INTEGER DEFAULT 1,
                alarm_minutes   INTEGER DEFAULT 30,
                created_at      TEXT NOT NULL DEFAULT (datetime('now'))
            );
        """)
        conn.commit()


def row_to_event(row: sqlite3.Row) -> dict:
    """Convert a DB row to a camelCase dict matching the frontend CalendarEvent type."""
    return {
        "id": row["id"],
        "userEmail": row["user_email"],
        "courseId": row["course_id"],
        "title": row["title"],
        "dayOfWeek": row["day_of_week"],
        "startTime": row["start_time"],
        "endTime": row["end_time"],
        "type": row["type"],
        "location": row["location"],
        "color": row["color"],
        "alarmEnabled": bool(row["alarm_enabled"]),
        "alarmMinutes": row["alarm_minutes"],
    }