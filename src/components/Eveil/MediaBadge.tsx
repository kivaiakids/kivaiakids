import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Headphones, 
  Video, 
  FileText 
} from 'lucide-react';

interface MediaBadgeProps {
  type: 'image' | 'audio' | 'video' | 'pdf';
  className?: string;
}

const MediaBadge: React.FC<MediaBadgeProps> = ({ type, className = '' }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'image':
        return {
          icon: Image,
          label: 'Image',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'audio':
        return {
          icon: Headphones,
          label: 'Audio',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'video':
        return {
          icon: Video,
          label: 'Vidéo',
          variant: 'default' as const,
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        };
      case 'pdf':
        return {
          icon: FileText,
          label: 'PDF',
          variant: 'default' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      default:
        return {
          icon: Image,
          label: 'Média',
          variant: 'default' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      <IconComponent className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default MediaBadge;
