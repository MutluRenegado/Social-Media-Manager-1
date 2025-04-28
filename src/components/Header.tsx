import React from "react";

interface HeaderProps {
  onNext: () => void;
  onPrev: () => void;
  onBack: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onNext,
  onPrev,
  onBack,
  disablePrev = false,
  disableNext = false,
}) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Your Site Title</h1>

      {/* Next and Previous buttons side by side */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          aria-label="Next"
          onClick={onNext}
          disabled={disableNext}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            disableNext ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          &rarr; Next
        </button>

        <button
          type="button"
          aria-label="Previous"
          onClick={onPrev}
          disabled={disablePrev}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            disablePrev ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          &larr; Previous
        </button>
      </div>

      {/* Back button below */}
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        Back
      </button>
    </header>
  );
};

export default Header;
