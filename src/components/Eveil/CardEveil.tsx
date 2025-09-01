import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Eye, Download, Headphones, Play, FileText, Sparkles, Star, Heart } from 'lucide-react';
import { EveilItem, MediaItem } from '@/integrations/supabase/types-eveil';
import MediaBadge from './MediaBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CardEveilProps {
  item: EveilItem;
  onClick?: () => void;
  className?: string;
}

const CardEveil: React.FC<CardEveilProps> = ({ 
  item, 
  onClick, 
  className = '' 
}) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const isPremium = item.is_premium;
  const hasAccess = !isPremium || (user && profile?.is_premium);
  
  const getPrimaryMedia = (): MediaItem | null => {
    return item.media.length > 0 ? item.media[0] : null;
  };

  const getCTAText = (): string => {
    const media = getPrimaryMedia();
    if (!media) return 'Découvrir';
    
    switch (media.type) {
      case 'audio': return 'Écouter';
      case 'video': return 'Regarder';
      case 'pdf': return 'Télécharger';
      case 'image': 
      default: return 'Découvrir';
    }
  };

  const getCTAIcon = () => {
    const media = getPrimaryMedia();
    if (!media) return Eye;
    
    switch (media.type) {
      case 'audio': return Headphones;
      case 'video': return Play;
      case 'pdf': return Download;
      case 'image': 
      default: return Eye;
    }
  };

  const handleCTAClick = () => {
    if (!hasAccess) {
      navigate('/pricing');
      return;
    }
    
    // Naviguer vers la page de détail
    navigate(`/eveil/${item.slug}`);
  };

  // Générer une couleur de fond aléatoire basée sur le titre
  const getCardColor = () => {
    const colors = [
      'from-pink-100 to-purple-100',
      'from-blue-100 to-cyan-100',
      'from-green-100 to-emerald-100',
      'from-yellow-100 to-orange-100',
      'from-red-100 to-pink-100',
      'from-indigo-100 to-blue-100',
      'from-teal-100 to-green-100',
      'from-amber-100 to-yellow-100'
    ];
    const index = item.title.length % colors.length;
    return colors[index];
  };

  // Générer une icône décorative basée sur le titre
  const getDecorativeIcon = () => {
    const icons = [Sparkles, Star, Heart, Crown];
    const index = item.title.length % icons.length;
    const IconComponent = icons[index];
    return <IconComponent className="w-6 h-6" />;
  };

  const renderMediaPreview = () => {
    const media = getPrimaryMedia();
    if (!media) {
      // Aucun média - afficher une illustration décorative
      return (
        <div className={`w-full h-32 bg-gradient-to-br ${getCardColor()} rounded-t-lg relative overflow-hidden`}>
          {/* Formes géométriques décoratives */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/30 rounded-lg transform rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {getDecorativeIcon()}
          </div>
          
          {/* Badge du type d'activité */}
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-white/80 text-gray-700 border-0 shadow-sm">
              Activité
            </Badge>
          </div>
        </div>
      );
    }

    const baseClasses = "w-full h-32 relative overflow-hidden";
    
    switch (media.type) {
      case 'video':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-red-100 to-pink-100`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-red-500 text-white border-0">
                Vidéo
              </Badge>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-100 to-cyan-100`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-blue-500 text-white border-0">
                Audio
              </Badge>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-orange-100 to-yellow-100`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-orange-500 text-white border-0">
                PDF
              </Badge>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`${baseClasses} bg-gradient-to-br ${getCardColor()}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {getDecorativeIcon()}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03] border-0 shadow-md ${className}`}>
      {/* Header décoratif avec icône */}
      <div className="relative">
        {renderMediaPreview()}
        
        {/* Badge Premium flottant */}
        {isPremium && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <CardContent className="p-6 bg-white">
        {/* Titre et sous-titre */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Informations rapides */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>Activité</span>
          </div>
          
          {item.media.length > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{item.media.length} ressource{item.media.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleCTAClick}
          className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
            hasAccess 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300'
          }`}
          disabled={!hasAccess}
        >
          {hasAccess ? (
            <>
              {React.createElement(getCTAIcon(), { className: 'w-5 h-5 mr-2' })}
              {getCTAText()}
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Découvrir Premium
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardEveil;
