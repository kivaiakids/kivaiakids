import React from 'react';
import CourseCard from './course-card';
import CourseCardSkeleton from './course-card-skeleton';

// Données d'exemple pour la démonstration
const demoCourses = [
  {
    id: '1',
    title: 'Introduction aux Mathématiques',
    description: 'Découvre les bases des mathématiques de manière ludique et interactive. Parfait pour débuter !',
    category: 'mathematiques',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    video_url: 'https://example.com/video1.mp4',
    audio_url: 'https://example.com/audio1.mp3',
    file_url: 'https://example.com/document1.pdf',
    duration_minutes: 45
  },
  {
    id: '2',
    title: 'Sciences de la Nature',
    description: 'Explore le monde qui t\'entoure avec des expériences amusantes et des découvertes passionnantes.',
    category: 'sciences',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    video_url: 'https://example.com/video2.mp4',
    duration_minutes: 60
  },
  {
    id: '3',
    title: 'Apprentissage des Langues',
    description: 'Maîtrise une nouvelle langue avec des méthodes modernes et des exercices pratiques.',
    category: 'langues',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
    audio_url: 'https://example.com/audio3.mp3',
    file_url: 'https://example.com/document3.pdf',
    duration_minutes: 30
  }
];

const CourseCardDemo: React.FC = () => {
  const handleCourseClick = (courseId: string) => {
    console.log(`Clic sur le cours ${courseId}`);
    // Ici vous pouvez ajouter la logique pour ouvrir le modal ou naviguer
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Démonstration des Cartes de Cours Modernes
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cartes avec Données</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Skeletons de Chargement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fonctionnalités des Cartes</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Design moderne avec coins arrondis et ombres subtiles</li>
            <li>✅ Barre d'accent verte en haut pour l'identité de marque</li>
            <li>✅ Badge Premium avec couronne pour les cours premium</li>
            <li>✅ Thumbnails avec ratio 16:9 et scaling au hover</li>
            <li>✅ Badges de catégorie colorés</li>
            <li>✅ Tags média conditionnels (Vidéo, Audio, Document, Image)</li>
            <li>✅ Durée avec icône horloge</li>
            <li>✅ Bouton CTA "Voir" compact et accessible</li>
            <li>✅ Responsive : 1/2/3 colonnes selon la taille d'écran</li>
            <li>✅ Hover effects avec léger soulèvement et ombres</li>
            <li>✅ Skeleton loading pour les états de chargement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseCardDemo;
