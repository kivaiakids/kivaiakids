import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, Clock, ExternalLink, Video, Music, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  duration_minutes: number;
  published: boolean;
  created_at: string;
  video_url?: string;
  audio_url?: string;
  file_url?: string;
  learning_objective_1?: string;
  learning_objective_2?: string;
  learning_objective_3?: string;
}

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const CourseModal: React.FC<CourseModalProps> = ({ course, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!course) return null;

  const handleStartCourse = () => {
    onClose();
    if (user) {
      navigate(`/course/${course.id}`);
    } else {
      navigate('/auth');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasResources = course.video_url || course.audio_url || course.file_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800">
            {course.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image et informations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Image du cours</span>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-4">
              {/* Catégorie */}
              <Badge variant="secondary" className="text-sm">
                {categoryNames[course.category] || course.category}
              </Badge>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>

              {/* Métadonnées */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Publié le {formatDate(course.created_at)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Durée : {course.duration_minutes} minutes
                </div>
              </div>

              {/* Bouton Commencer */}
              <Button
                onClick={handleStartCourse}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                {user ? 'Commencer le cours' : 'S\'inscrire pour accéder au cours'}
              </Button>
            </div>
          </div>

          {/* Ce que tu vas apprendre */}
          {(course.learning_objective_1 || course.learning_objective_2 || course.learning_objective_3) && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Ce que tu vas apprendre
                </h3>
                <ul className="space-y-2">
                  {course.learning_objective_1 && (
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{course.learning_objective_1}</span>
                    </li>
                  )}
                  {course.learning_objective_2 && (
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{course.learning_objective_2}</span>
                    </li>
                  )}
                  {course.learning_objective_3 && (
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{course.learning_objective_3}</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ressources du cours */}
          {hasResources && (
            <Card className="bg-white border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Ressources du cours</h3>
                <div className="space-y-3">
                  {course.video_url && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Vidéo</span>
                      </div>
                    </div>
                  )}
                  
                  {course.audio_url && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Music className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Podcast</span>
                      </div>
                    </div>
                  )}
                  
                  {course.file_url && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Document</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;
