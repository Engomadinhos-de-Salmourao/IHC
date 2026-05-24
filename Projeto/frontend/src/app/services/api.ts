import { Course, CalendarEvent } from '../types';

const BASE_URL = '/api';

export const api = {
  // --- CURSOS ---
  async listCourses(filters: { search?: string; category?: string; schedule?: string; type?: string } = {}): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.schedule && filters.schedule !== 'All') params.append('schedule', filters.schedule);
    if (filters.type && filters.type !== 'All') params.append('type', filters.type);

    const res = await fetch(`${BASE_URL}/courses?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar cursos');
    return res.json();
  },

  // --- INSCRIÇÕES (SUBSCRIPTIONS) ---
  async getSubscriptions(email: string): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/subscriptions`);
    if (!res.ok) throw new Error('Erro ao buscar inscrições');
    return res.json();
  },

  async subscribe(email: string, courseId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/subscriptions/${courseId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Erro ao se inscrever no curso');
  },

  async unsubscribe(email: string, courseId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/subscriptions/${courseId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao cancelar inscrição');
  },

  // --- CALENDÁRIO ---
  async listEvents(email: string): Promise<CalendarEvent[]> {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/events`);
    if (!res.ok) throw new Error('Erro ao buscar eventos do calendário');
    
    // CORREÇÃO AQUI: O backend já retorna em camelCase por conta do row_to_event()
    return res.json();
  },

  async createEvent(email: string, event: CalendarEvent): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: event.id,
        courseId: event.courseId,
        title: event.title,
        dayOfWeek: event.dayOfWeek,
        startTime: event.startTime,
        endTime: event.endTime,
        type: event.type || 'online',
        location: event.location || 'Online',
        color: event.color || '#3b82f6',
        alarmEnabled: event.alarmEnabled,
        alarmMinutes: event.alarmMinutes,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Erro ao criar evento no calendário');
    }
  },

  async updateAlarm(email: string, eventId: string, enabled: boolean, minutes: number = 30): Promise<void> {
    const query = new URLSearchParams({
      alarm_enabled: String(enabled),
      alarm_minutes: String(minutes)
    });
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}/events/${eventId}/alarm?${query.toString()}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Erro ao atualizar alarme');
  }
};