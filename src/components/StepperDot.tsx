import React from "react";

interface StepperDotProps {
  title: string;
  description: string;
  progressPercent: number;
  fade?: boolean;
}

const StepperDot: React.FC<StepperDotProps> = ({
  title,
  description,
  progressPercent,
  fade = false,
}) => {
  return (
    <div
      className={`p-4 bg-white shadow rounded transition-opacity duration-300 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="bg-blue-600 h-2 rounded"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default StepperDot;
