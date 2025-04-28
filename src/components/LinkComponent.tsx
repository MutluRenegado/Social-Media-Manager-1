// src/components/LinkComponent.tsx

import React from "react";
import Link from "next/link"; // Import Next.js Link for client-side navigation

interface LinkComponentProps {
  href: string;
  label: string;
}

const LinkComponent: React.FC<LinkComponentProps> = ({ href, label }) => {
  return (
    <div className="p-4">
      <Link
        href={href}
        className="text-blue-600 hover:underline text-xl font-bold"
      >
        {label}
      </Link>
    </div>
  );
};

export default LinkComponent;
