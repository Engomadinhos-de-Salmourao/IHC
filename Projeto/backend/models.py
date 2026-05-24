from pydantic import BaseModel
from typing import Optional, List


# ──────────────────────────────────────────────
# Course models
# ──────────────────────────────────────────────

class Course(BaseModel):
    id: str
    title: str
    platform: str
    category: str
    schedule: str
    type: str
    duration: str
    summary: str
    description: str
    syllabus: List[str]
    startDate: str
    requirements: str
    image: str


class CourseSearchParams(BaseModel):
    search: Optional[str] = ""
    category: Optional[str] = "All"
    schedule: Optional[str] = "All"
    type: Optional[str] = "All"


# ──────────────────────────────────────────────
# Calendar models
# ──────────────────────────────────────────────

class CalendarEventCreate(BaseModel):
    id: str
    courseId: Optional[str] = None
    title: str
    dayOfWeek: int           # 0 = Sunday … 6 = Saturday
    startTime: str           # "HH:MM"
    endTime: str             # "HH:MM"
    type: Optional[str] = "online"
    location: Optional[str] = "Online"
    color: str = "#3b82f6"
    alarmEnabled: bool = True
    alarmMinutes: int = 30


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    dayOfWeek: Optional[int] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    color: Optional[str] = None
    alarmEnabled: Optional[bool] = None
    alarmMinutes: Optional[int] = None


class CalendarEvent(CalendarEventCreate):
    userEmail: str


# ──────────────────────────────────────────────
# Subscription models
# ──────────────────────────────────────────────

class SubscriptionResponse(BaseModel):
    userEmail: str
    courseId: str
    subscribed: bool


# ──────────────────────────────────────────────
# Generic responses
# ──────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str