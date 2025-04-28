import React from "react";

interface HeaderProps {
  userId: string;
}

const NewHeader: React.FC<HeaderProps> = ({ userId }) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold">Your Site Title</h1>
      </div>
      <div className="text-sm font-medium">User: {userId}</div>
    </header>
  );
};

export default NewHeader;
