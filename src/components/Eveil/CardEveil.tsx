import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Eye, Download, Headphones, Play, FileText } from 'lucide-react';
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
    if (!media) return 'Voir';
    
    switch (media.type) {
      case 'audio': return 'Écouter';
      case 'video': return 'Regarder';
      case 'pdf': return 'Télécharger';
      case 'image': 
      default: return 'Voir';
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

  const renderMediaPreview = () => {
    const media = getPrimaryMedia();
    if (!media) return null;

    const baseClasses = "w-full h-48 object-cover rounded-t-lg";
    
    switch (media.type) {
      case 'image':
        return (
          <img 
            src={media.url} 
            alt={media.caption || item.title}
            className={baseClasses}
            loading="lazy"
          />
        );
      
      case 'video':
        return (
          <div className="relative">
            <img 
              src={media.poster || '/placeholder.svg'} 
              alt={media.caption || item.title}
              className={baseClasses}
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-800 ml-1" />
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              <Headphones className="w-16 h-16 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Audio</p>
              {media.caption && (
                <p className="text-green-600 text-sm mt-1">{media.caption}</p>
              )}
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-red-100 to-orange-100 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Document PDF</p>
              {media.caption && (
                <p className="text-red-600 text-sm mt-1">{media.caption}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200 ${className}`}>
      {/* Media Preview */}
      {renderMediaPreview()}
      
      {/* Content */}
      <CardContent className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {item.subtitle}
              </p>
            )}
          </div>
          
          {/* Premium badge */}
          {isPremium && (
            <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {/* Media type badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.media.map((media, index) => (
            <MediaBadge key={index} type={media.type} />
          ))}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-gray-50"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleCTAClick}
          className={`w-full h-11 ${
            hasAccess 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          disabled={!hasAccess}
        >
          {hasAccess ? (
            <>
              {React.createElement(getCTAIcon(), { className: 'w-4 h-4 mr-2' })}
              {getCTAText()}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Découvrir Premium
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardEveil;
