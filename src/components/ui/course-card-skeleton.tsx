import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CourseCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
      
      {/* Header with thumbnail skeleton */}
      <CardHeader className="p-0 pb-4">
        <div className="relative overflow-hidden">
          <div className="w-full h-36 bg-gray-200 animate-pulse" />
        </div>
      </CardHeader>

      {/* Content skeleton */}
      <CardContent className="px-5 pb-5 space-y-3">
        {/* Category badge skeleton */}
        <div className="flex justify-start">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Media tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCardSkeleton;
