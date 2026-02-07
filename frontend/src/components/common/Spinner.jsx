
const Spinner = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header with avatar and text */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
      </div>
    </div>
  );
};

export default Spinner;