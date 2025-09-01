import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SectionTileProps {
  title: string;
  subtitle?: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

const SectionTile: React.FC<SectionTileProps> = ({
  title,
  subtitle,
  href,
  icon,
  className = ''
}) => {
  return (
    <Link to={href} className="block group">
      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200 hover:border-emerald-300 ${className}`}>
        <CardContent className="p-6 h-full flex flex-col">
          {/* Icon */}
          {icon && (
            <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-gray-600 text-sm leading-relaxed text-center flex-1">
              {subtitle}
            </p>
          )}
          
          {/* Arrow indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
              <svg 
                className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SectionTile;
