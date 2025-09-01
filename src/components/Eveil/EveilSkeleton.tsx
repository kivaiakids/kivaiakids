import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EveilSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      {/* Media skeleton */}
      <Skeleton className="w-full h-48 rounded-t-lg" />
      
      <CardContent className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-6 w-16 ml-2" />
        </div>

        {/* Media badges skeleton */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-1 mb-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="w-full h-11" />
      </CardContent>
    </Card>
  );
};

export default EveilSkeleton;
