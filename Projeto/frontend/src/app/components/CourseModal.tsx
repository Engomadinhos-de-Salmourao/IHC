import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, ExternalLink, Check, Laptop, Bell, BellOff, AlertCircle } from 'lucide-react';
import { Course } from '../types';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CourseModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onAddToCalendar: (course: Course, alarmEnabled: boolean, alarmMinutes: number) => void;
}

export function CourseModal({ course, open, onClose, onAddToCalendar }: CourseModalProps) {
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmMinutes, setAlarmMinutes] = useState(30);
  
  if (!course) return null;

  const handleAddToCalendar = () => {
    const isLoggedIn = storage.isLoggedIn();
    
    if (!isLoggedIn) {
      storage.saveGuestCourse(course.id);
      toast.success('Curso salvo! Faça login para adicionar ao calendário.');
    } else {
      onAddToCalendar(course, alarmEnabled, alarmMinutes);
      toast.success('Curso adicionado ao calendário!' + (alarmEnabled ? ' Alarme configurado.' : ''));
    }
    onClose();
  };

  const handleGoToCourse = () => {
    toast.info(`Redirecionando para ${course.platform}...`);
    // In real app, would open external link
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl">{course.title}</DialogTitle>
              <DialogDescription className="text-base">
                {course.platform}
              </DialogDescription>
            </div>
            <Badge className="bg-green-600 hover:bg-green-700 shrink-0">
              100% GRÁTIS
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* IMPORTANT: Course Start Date Highlight */}
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border-2 border-amber-400">
            <AlertCircle className="size-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900 text-lg">Data de Início: {new Date(course.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p className="text-sm text-amber-700">Não perca essa oportunidade!</p>
            </div>
          </div>

          {/* Course Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Sobre o Curso</h3>
            <p className="text-gray-600">{course.description}</p>
          </div>

          {/* Syllabus */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">O que você vai aprender</h3>
            <ul className="space-y-2">
              {course.syllabus.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="size-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Início</p>
              <p className="font-medium">{new Date(course.startDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Duração</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Formato</p>
              <p className="font-medium">{course.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Horário</p>
              <p className="font-medium">{course.schedule}</p>
            </div>
          </div>

          {/* Requirements */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Laptop className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-blue-900">Requisitos Técnicos</p>
              <p className="text-sm text-blue-700">{course.requirements}</p>
            </div>
          </div>

          {/* Certificate Badge */}
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <Check className="size-5 text-green-600" />
            <p className="font-medium text-green-900">Certificado 100% Gratuito ao concluir</p>
          </div>

          {/* Alarm Configuration */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {alarmEnabled ? (
                  <Bell className="size-5 text-purple-600" />
                ) : (
                  <BellOff className="size-5 text-gray-400" />
                )}
                <p className="font-medium text-purple-900">Configurar Alarme</p>
              </div>
              <Button
                size="sm"
                variant={alarmEnabled ? "default" : "outline"}
                onClick={() => setAlarmEnabled(!alarmEnabled)}
                className={alarmEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {alarmEnabled ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
            {alarmEnabled && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-purple-700">Lembrar</p>
                <Select
                  value={alarmMinutes.toString()}
                  onValueChange={(value) => setAlarmMinutes(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-purple-700">antes</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleGoToCourse}
            >
              <ExternalLink className="mr-2 size-4" />
              Ir para a Página do Curso
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleAddToCalendar}
            >
              <Calendar className="mr-2 size-4" />
              Adicionar ao Calendário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}