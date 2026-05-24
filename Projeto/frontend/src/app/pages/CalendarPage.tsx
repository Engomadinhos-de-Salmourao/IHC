import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { GraduationCap, ChevronLeft, ChevronRight, ArrowLeft, Bell, MapPin, ExternalLink } from 'lucide-react';
import { AccessibilityBar } from '../components/AccessibilityBar';
import { storage } from '../utils/storage';
import { Course, CalendarEvent } from '../types';
import { api } from '../services/api';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

export default function CalendarPage() {
  const navigate = useNavigate();
  const user = storage.getUser();
  
  if (!user || !user.email) {
    navigate('/login');
    return null;
  }

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 30)); // March 23, 2026
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [subscribedCourses, setSubscribedCourses] = useState<Course[]>([]);

  // Carrega os dados salvos no banco de dados via API
  useEffect(() => {
    async function loadCalendarData() {
      try {
        const events = await api.listEvents(user.email);
        setCalendarEvents(events);

        // Busca todos os cursos disponíveis para fazer o cruzamento com as IDs inscritas
        const allCourses = await api.listCourses();
        const subIds = await api.getSubscriptions(user.email);
        const filtered = allCourses.filter(c => subIds.includes(c.id));
        setSubscribedCourses(filtered);
      } catch (err) {
        toast.error('Erro ao sincronizar informações com o servidor.');
      }
    }
    loadCalendarData();
  }, [user.email]);

  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  const getEventsForDay = (dayOfWeek: number) => {
    return calendarEvents.filter(event => event.dayOfWeek === dayOfWeek);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Trata o toggle do alarme no backend via API
  const handleAlarmToggle = async (event: CalendarEvent, checked: boolean) => {
    try {
      await api.updateAlarm(user.email, event.id, checked, event.alarmMinutes);
      
      // Atualiza o estado local para refletir na interface sem dar reload completo
      setCalendarEvents(prev => prev.map(e => e.id === event.id ? { ...e, alarmEnabled: checked } : e));
      toast.success(checked ? 'Lembrete ativado no servidor' : 'Lembrete desativado no servidor');
    } catch (err) {
      toast.error('Erro ao atualizar alarme no servidor.');
    }
  };

  const getEventPosition = (event: CalendarEvent) => {
    const [hours] = event.startTime.split(':').map(Number);
    const startIndex = timeSlots.findIndex(slot => Number(slot.split(':')[0]) === hours);
    const [endHours] = event.endTime.split(':').map(Number);
    const endIndex = timeSlots.findIndex(slot => Number(slot.split(':')[0]) === endHours);

    const top = startIndex * 60;
    const height = (endIndex - startIndex) * 60;
    return { top, height };
  };

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="min-h-screen bg-gray-50">
      <AccessibilityBar />
      
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="size-5" /></Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="size-8 text-blue-600" />
                <h1 className="text-2xl text-blue-600">EducaFree</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">{user.name}</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {dayNames.map(day => (<div key={day} className="font-medium text-gray-500 py-2">{day}</div>))}
                  {weekDays.map((date, i) => (
                    <div key={i} className={`py-2 rounded ${date.getDate() === currentDate.getDate() ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-100'}`}>
                      {date.getDate()}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Meus Cursos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {subscribedCourses.length > 0 ? (
                  subscribedCourses.map(course => (
                    <div key={course.id} className="flex items-start gap-2">
                      <Checkbox id={course.id} checked className="mt-1" />
                      <label htmlFor={course.id} className="text-sm leading-tight cursor-pointer flex-1">{course.title}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhum curso inscrito ainda.{' '}
                    <Button variant="link" className="h-auto p-0 text-blue-600" onClick={() => navigate('/')}>Explorar cursos</Button>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Semana de {weekDays[0].getDate()} a {weekDays[6].getDate()} de {monthNames[currentDate.getMonth()]}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousWeek}><ChevronLeft className="size-4" /></Button>
                <Button variant="outline" size="icon" onClick={handleNextWeek}><ChevronRight className="size-4" /></Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="text-sm font-medium text-gray-500">Horário</div>
                    {weekDays.map((date, i) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div key={i} className="text-center">
                          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>{dayNames[date.getDay()]}</div>
                          <div className={`text-lg ${isToday ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>{date.getDate()}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative">
                    {timeSlots.map((time) => (
                      <div key={time} className="grid grid-cols-8 gap-2 border-t">
                        <div className="text-sm text-gray-500 py-4 text-right pr-2">{time}</div>
                        {weekDays.map((_, dayIndex) => (
                          <div key={dayIndex} className="relative h-[60px] border-l bg-gray-50 hover:bg-gray-100"></div>
                        ))}
                      </div>
                    ))}

                    {weekDays.map((date, dayIndex) => {
                      const dayEvents = getEventsForDay(date.getDay());
                      return dayEvents.map(event => {
                        const { top, height } = getEventPosition(event);
                        return (
                          <Popover key={event.id}>
                            <PopoverTrigger asChild>
                              <button
                                className="absolute rounded px-2 py-1 text-white text-xs overflow-hidden hover:opacity-90 transition-opacity"
                                style={{
                                  backgroundColor: event.color,
                                  top: `${top + 40}px`,
                                  left: `${(dayIndex + 1) * 12.5}%`,
                                  width: '11.5%',
                                  height: `${height - 4}px`,
                                  zIndex: 10
                                }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="text-xs opacity-90">{event.startTime}</div>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{event.title}</h3>
                                  <p className="text-sm text-gray-500 mt-1">{event.startTime} - {event.endTime}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="size-4 text-gray-500" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-t">
                                  <div className="flex items-center gap-2">
                                    <Bell className="size-4" />
                                    <Label htmlFor={`reminder-${event.id}`} className="text-sm">Lembrete ({event.alarmMinutes} min antes)</Label>
                                  </div>
                                  <Switch
                                    id={`reminder-${event.id}`}
                                    checked={event.alarmEnabled}
                                    onCheckedChange={(checked) => handleAlarmToggle(event, checked)}
                                  />
                                </div>
                                <Button className="w-full" variant="outline">
                                  <ExternalLink className="mr-2 size-4" /> Abrir Informações do Curso
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        );
                      });
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-500"></div><span>Tecnologia</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500"></div><span>Negócios</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500"></div><span>Idiomas</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}