import React from 'react';

const Spinner = () => {
  return (
    <div className="w-full max-w-md p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
    </div>
  );
};

export default Spinner;