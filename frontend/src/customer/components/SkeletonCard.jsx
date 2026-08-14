import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white border border-[#E9DFD0] rounded-2xl overflow-hidden shadow-xs animate-pulse p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Aspect Ratio Box */}
      <div className="bg-gray-200 aspect-square w-full rounded-xl"></div>
      
      {/* Title / Description Skeletons */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
      </div>

      {/* Button Skeleton */}
      <div className="pt-2 flex items-center justify-between">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
