// src/components/Providers.tsx

"use client"; // If you're using Next.js App Router

import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <div>
      {/* Example: Wrap children with your actual providers here */}
      {children}
    </div>
  );
};

export default Providers;
