import React from "react";

const ProgressBar = () => {
  return (
    <div>
      <div className="mb-1 flex w-[50%] justify-between">
        <span>$invested raised</span>
        <span>Goal:$cap</span>
      </div>
      <div className="w-full">
        <div className="h-4 rounded-full bg-gray-200">
          <div
            className="h-4 w-[50%] rounded-full bg-pink-500 transition-all duration-500"
            style={{ width: `$88%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
