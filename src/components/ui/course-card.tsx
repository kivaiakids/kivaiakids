import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Video, Music, FileText, Image, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    category: string;
    is_premium: boolean;
    thumbnail_url?: string;
    video_url?: string;
    audio_url?: string;
    file_url?: string;
    duration_minutes?: number;
  };
  onClick: () => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  mathematiques: 'bg-blue-100 text-blue-800 border-blue-200',
  sciences: 'bg-green-100 text-green-800 border-green-200',
  langues: 'bg-purple-100 text-purple-800 border-purple-200',
  histoire: 'bg-orange-100 text-orange-800 border-orange-200',
  geographie: 'bg-teal-100 text-teal-800 border-teal-200',
  arts: 'bg-pink-100 text-pink-800 border-pink-200',
  sport: 'bg-red-100 text-red-800 border-red-200',
  informatique: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

const categoryNames: Record<string, string> = {
  mathematiques: 'Mathématiques',
  sciences: 'Sciences',
  langues: 'Langues',
  histoire: 'Histoire',
  geographie: 'Géographie',
  arts: 'Arts',
  sport: 'Sport',
  informatique: 'Informatique'
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, className }) => {
  const hasMedia = course.video_url || course.audio_url || course.file_url || course.thumbnail_url;
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-sm",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "hover:-translate-y-1 md:hover:-translate-y-2",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
      
      {/* Premium badge - top right */}
      {course.is_premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg text-xs font-semibold px-2 py-1">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      {/* Header with thumbnail */}
      <CardHeader className="p-0 pb-4">
        <div className="relative overflow-hidden">
          {/* Thumbnail container - 16:9 aspect ratio */}
          <div className="relative w-full h-36 bg-gradient-to-br from-green-400 to-emerald-600">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-5 pb-5 space-y-3">
        {/* Category badge */}
        <div className="flex justify-start">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs font-medium px-2.5 py-1",
              categoryColors[course.category] || "bg-gray-100 text-gray-800 border-gray-200"
            )}
          >
            {categoryNames[course.category] || course.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Media tags - only show existing ones */}
        {hasMedia && (
          <div className="flex flex-wrap gap-1.5">
            {course.video_url && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-blue-200 text-blue-700 bg-blue-50">
                <Video className="h-2.5 w-2.5 mr-1" />
                Vidéo
              </Badge>
            )}
            {course.audio_url && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-purple-200 text-purple-700 bg-purple-50">
                <Music className="h-2.5 w-2.5 mr-1" />
                Audio
              </Badge>
            )}
            {course.file_url && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-green-200 text-green-700 bg-green-50">
                <FileText className="h-2.5 w-2.5 mr-1" />
                Document
              </Badge>
            )}
            {course.thumbnail_url && !course.video_url && !course.audio_url && !course.file_url && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-orange-200 text-orange-700 bg-orange-50">
                <Image className="h-2.5 w-2.5 mr-1" />
                Image
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Duration */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{course.duration_minutes || 0} min</span>
          </div>

          {/* CTA Button */}
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Play className="h-4 w-4 mr-1.5" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
