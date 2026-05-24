export interface Course {
  id: string;
  title: string;
  platform: string;
  category: string;
  schedule: string;
  type: string;
  duration: string;
  summary: string;
  description: string;
  syllabus: string[];
  startDate: string;
  requirements: string;
  image: string;
}

export interface CalendarEvent {
  id: string;
  courseId: string;
  title: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "19:00"
  endTime: string; // "21:00"
  type: string; // "online" | "in-person"
  location: string;
  color: string;
  alarmEnabled?: boolean;
  alarmMinutes?: number; // Minutes before event to trigger alarm
}

export interface User {
  name: string;
  email: string;
  subscribedCourses: string[];
  calendarEvents: CalendarEvent[];
}