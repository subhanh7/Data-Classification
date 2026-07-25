import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded-xl"></div>
          <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          <div className="h-10 w-36 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 h-32 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
            <div className="h-3 w-36 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Info Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-64 space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-64 space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
