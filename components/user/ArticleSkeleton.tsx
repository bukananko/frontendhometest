import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleSkeleton = ({ total }: { total: number }) => {
  return new Array(total).fill(0).map((_, i) => (
    <div key={i} className='flex flex-col space-y-3'>
      <Skeleton className='h-60 lg:w-[390px] rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  ));
};

export default ArticleSkeleton;
