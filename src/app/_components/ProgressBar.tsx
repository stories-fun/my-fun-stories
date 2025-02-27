import React from "react";
import { usePresale } from "~/context/PresaleContext";

const ProgressBar = () => {
  const { tokensSold, hardcap } = usePresale();
  // const progress = (tokensSold / hardcap) * 100;
  const progress = 50;

  return (
    <div>
      <div className="mb-3 text-sm font-bold">
        <span>Participate in Presale of this token now!</span>
      </div>
      <div className="w-[100%]">
        <div className="h-2 rounded-full bg-[#00000099]">
          <div
            className="mb-2 h-2 rounded-full bg-[#46D160] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
