import React from "react";

const ProgressBar = () => {
  return (
    <div>
      <div className="mb-3 font-bold">
        <span>Participate in presale of this token now!</span>
      </div>
      <div className="w-[80%]">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="mb-2 h-2 w-[40%] rounded-full bg-[#46D160] transition-all duration-500"
            style={{ width: `$88%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
