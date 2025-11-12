import React from 'react';
import { Card, CardContent } from './ui/Card';

export const BookCardSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <Card className="mb-4 rounded-xl border-secondary-200">
        <CardContent className="p-4">
          <div className="flex gap-6 animate-pulse">
            <div className="w-24 h-36 bg-secondary-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              <div className="h-4 bg-secondary-200 rounded w-full"></div>
              <div className="h-4 bg-secondary-200 rounded w-5/6"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-secondary-200 rounded w-24"></div>
                <div className="h-8 bg-secondary-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border-secondary-200">
      <div className="animate-pulse">
        <div className="w-full h-64 bg-secondary-200"></div>
        <CardContent className="p-4 space-y-3">
          <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-8 bg-secondary-200 rounded w-24"></div>
            <div className="h-8 bg-secondary-200 rounded w-24"></div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
