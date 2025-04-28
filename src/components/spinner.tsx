import React from 'react';

const Spinner = () => {
  return (
    <div
      className="
        w-8 h-8
        border-4 border-t-blue-600 border-gray-200
        rounded-full
        animate-spin
      "
      aria-label="Loading spinner"
    />
  );
};

export default Spinner;
