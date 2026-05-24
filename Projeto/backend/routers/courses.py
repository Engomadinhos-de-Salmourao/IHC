"""
Courses API
-----------
GET  /api/courses                          – list / search / filter courses
GET  /api/courses/{course_id}              – get a single course
GET  /api/users/{user_email}/subscriptions – list subscribed course IDs
POST /api/users/{user_email}/subscriptions/{course_id}   – subscribe
DELETE /api/users/{user_email}/subscriptions/{course_id} – unsubscribe
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from database import get_db
from models import Course, MessageResponse, SubscriptionResponse
from seed_data import COURSES, COURSES_BY_ID

router = APIRouter(tags=["courses"])


# ──────────────────────────────────────────────────────────
# Course catalogue
# ──────────────────────────────────────────────────────────

@router.get("/courses", response_model=list[Course])
def list_courses(
    search: Optional[str] = Query(default="", description="Full-text search in title/summary/category"),
    category: Optional[str] = Query(default="All"),
    schedule: Optional[str] = Query(default="All"),
    type: Optional[str] = Query(default="All"),
):
    """Return courses that match the given filters."""
    results = COURSES

    if search:
        q = search.lower()
        results = [
            c for c in results
            if q in c.title.lower()
            or q in c.summary.lower()
            or q in c.category.lower()
            or q in c.platform.lower()
        ]

    if category and category != "All":
        results = [c for c in results if c.category == category]

    if schedule and schedule != "All":
        results = [c for c in results if c.schedule == schedule]

    if type and type != "All":
        results = [c for c in results if c.type == type]

    return results


@router.get("/courses/{course_id}", response_model=Course)
def get_course(course_id: str):
    """Return a single course by ID."""
    course = COURSES_BY_ID.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


# ──────────────────────────────────────────────────────────
# Subscriptions
# ──────────────────────────────────────────────────────────

@router.get("/users/{user_email}/subscriptions", response_model=list[str])
def get_subscriptions(user_email: str):
    """Return a list of course IDs the user is subscribed to."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT course_id FROM subscriptions WHERE user_email = ? ORDER BY created_at",
            (user_email,),
        ).fetchall()
    return [row["course_id"] for row in rows]


@router.get("/users/{user_email}/subscriptions/courses", response_model=list[Course])
def get_subscribed_courses(user_email: str):
    """Return full course objects for the user's subscriptions."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT course_id FROM subscriptions WHERE user_email = ? ORDER BY created_at",
            (user_email,),
        ).fetchall()
    ids = [row["course_id"] for row in rows]
    return [COURSES_BY_ID[cid] for cid in ids if cid in COURSES_BY_ID]


@router.post(
    "/users/{user_email}/subscriptions/{course_id}",
    response_model=SubscriptionResponse,
    status_code=201,
)
def subscribe(user_email: str, course_id: str):
    """Subscribe the user to a course (idempotent)."""
    if course_id not in COURSES_BY_ID:
        raise HTTPException(status_code=404, detail="Course not found")

    with get_db() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO subscriptions (user_email, course_id)
            VALUES (?, ?)
            """,
            (user_email, course_id),
        )
        conn.commit()

    return SubscriptionResponse(userEmail=user_email, courseId=course_id, subscribed=True)


@router.delete(
    "/users/{user_email}/subscriptions/{course_id}",
    response_model=SubscriptionResponse,
)
def unsubscribe(user_email: str, course_id: str):
    """Unsubscribe the user from a course (idempotent)."""
    with get_db() as conn:
        conn.execute(
            "DELETE FROM subscriptions WHERE user_email = ? AND course_id = ?",
            (user_email, course_id),
        )
        conn.commit()

    return SubscriptionResponse(userEmail=user_email, courseId=course_id, subscribed=False)