import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-700">
          GRATUITO
        </Badge>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {course.platform}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Highlighted Start Date */}
        <div className="flex items-center gap-2 p-2 bg-amber-100 rounded-md border border-amber-300">
          <Calendar className="size-4 text-amber-700" />
          <span className="text-sm font-semibold text-amber-900">
            Início: {new Date(course.startDate).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {course.summary}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>{course.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{course.schedule}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{course.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}