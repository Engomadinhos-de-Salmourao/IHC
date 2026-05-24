import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { GraduationCap, Search, User, LogOut, Calendar as CalendarIcon } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { CourseModal } from '../components/CourseModal';
import { AccessibilityBar } from '../components/AccessibilityBar';
import { categories, schedules, types } from '../data/courses'; // Removido 'courses' daqui
import { Course, CalendarEvent } from '../types';
import { storage } from '../utils/storage';
import { api } from '../services/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSchedule, setSelectedSchedule] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = storage.getUser();
  const isLoggedIn = storage.isLoggedIn();

  // Busca os cursos na API quando os filtros mudam
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await api.listCourses({
          search: searchQuery,
          category: selectedCategory,
          schedule: selectedSchedule,
          type: selectedType
        });
        setCoursesList(data);
      } catch (error) {
        toast.error('Não foi possível carregar os cursos do servidor.');
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce simples para a busca por texto não sobrecarregar o backend
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, selectedSchedule, selectedType]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleAddToCalendar = async (course: Course, alarmEnabled: boolean = true, alarmMinutes: number = 30) => {
    if (!isLoggedIn || !user?.email) {
      toast.error('Faça login para adicionar ao calendário');
      return;
    }

    // Mapeamento correto de turnos para números de dias reais no JavaScript/SQLite (1 = Segunda, 2 = Terça, etc.)
    let dayOfWeek = 1; 
    let startTime = '19:00';
    let endTime = '21:00';

    if (course.schedule === 'Morning') {
      dayOfWeek = 2; // Terça
      startTime = '09:00';
      endTime = '11:00';
    } else if (course.schedule === 'Afternoon') {
      dayOfWeek = 3; // Quarta
      startTime = '14:00';
      endTime = '16:00';
    } else if (course.schedule === 'Evening') {
      dayOfWeek = 1; // Segunda
      startTime = '19:00';
      endTime = '21:00';
    }

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const event: CalendarEvent = {
      id: `event-${Date.now()}`,
      courseId: course.id,
      title: course.title,
      dayOfWeek,
      startTime,
      endTime,
      type: course.type.toLowerCase() === 'online' ? 'online' : 'presencial',
      location: course.type === 'Online' ? 'Online' : course.platform,
      color,
      alarmEnabled,
      alarmMinutes
    };

    try {
      // Sincroniza com as rotas FastAPI
      await api.subscribe(user.email, course.id);
      await api.createEvent(user.email, event);
      
      // Atualiza o estado local para consistência em tempo de execução
      const currentSubscribed = user.subscribedCourses || [];
      if (!currentSubscribed.includes(course.id)) {
        storage.saveUser({
          ...user,
          subscribedCourses: [...currentSubscribed, course.id]
        });
      }
      
      toast.success('Curso adicionado ao seu calendário!');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Falha ao sincronizar dados com o servidor.');
    }
  };

  const handleLogout = () => {
    storage.clearUser();
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AccessibilityBar />
      
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-8 text-blue-600" />
              <h1 className="text-2xl text-blue-600">EducaFree</h1>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn && (
                <Button variant="outline" onClick={() => navigate('/calendar')} className="hidden sm:flex">
                  <CalendarIcon className="mr-2 size-4" />
                  Meu Calendário
                </Button>
              )}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="size-5" />
                  </Button>
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="size-5" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">
            {isLoggedIn ? `Olá, ${user?.name}!` : 'Bem-vindo ao EducaFree'}
          </h2>
          <p className="text-gray-600">Descubra cursos gratuitos e expanda seus conhecimentos</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Busque por Front-end, Excel, Logística..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Horário</label>
            <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {schedules.map(schedule => (<SelectItem key={schedule} value={schedule}>{schedule}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {types.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl">
            {loading ? 'Carregando cursos...' : `${coursesList.length} cursos encontrados`}
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Buscando cursos atualizados...</div>
        ) : coursesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesList.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => handleCourseClick(course)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum curso encontrado com os filtros selecionados.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSchedule('All');
                setSelectedType('All');
              }}
              className="mt-4"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {isLoggedIn && (
          <div className="sm:hidden fixed bottom-6 right-6">
            <Button size="lg" className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/calendar')}>
              <CalendarIcon className="mr-2 size-5" /> Calendário
            </Button>
          </div>
        )}
      </main>

      <CourseModal
        course={selectedCourse}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCalendar={handleAddToCalendar}
      />
    </div>
  );
}