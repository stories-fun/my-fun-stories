const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="mt-4 flex h-[550px] flex-col gap-4 border-b-2 sm:flex-col md:flex-row">
        <div className="flex-2 w-full md:w-2/3">
          {/* Profile section loading */}
          <div className="mb-4 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          </div>

          {/* Image slider loading */}
          <div className="mb-4 h-[300px] rounded-lg bg-gray-200" />

          {/* Post actions loading */}
          <div className="mb-4 flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Progress bar loading */}
          <div className="h-2 rounded bg-gray-200" />
        </div>

        {/* Content section loading */}
        <div className="w-full md:w-1/3">
          <div className="space-y-4 p-4">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="h-4 w-4/6 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
