import { User, CalendarEvent } from '../types';

const USER_KEY = 'educafree_user';
const GUEST_COURSES_KEY = 'educafree_guest_courses';

export const storage = {
  // User management
  saveUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(USER_KEY);
  },

  // Guest browsing
  saveGuestCourse: (courseId: string) => {
    const courses = storage.getGuestCourses();
    if (!courses.includes(courseId)) {
      courses.push(courseId);
      localStorage.setItem(GUEST_COURSES_KEY, JSON.stringify(courses));
    }
  },

  getGuestCourses: (): string[] => {
    const data = localStorage.getItem(GUEST_COURSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Update user's subscribed courses
  addCourseToUser: (courseId: string) => {
    const user = storage.getUser();
    if (user && !user.subscribedCourses.includes(courseId)) {
      user.subscribedCourses.push(courseId);
      storage.saveUser(user);
    }
  },

  // Update user's calendar events
  addCalendarEvent: (event: CalendarEvent) => {
    const user = storage.getUser();
    if (user) {
      user.calendarEvents.push(event);
      storage.saveUser(user);
    }
  },

  removeCalendarEvent: (eventId: string) => {
    const user = storage.getUser();
    if (user) {
      user.calendarEvents = user.calendarEvents.filter(e => e.id !== eventId);
      storage.saveUser(user);
    }
  }
};
