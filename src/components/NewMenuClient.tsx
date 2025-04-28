"use client";

import React from "react";
import Link from "next/link";

interface NewMenuClientProps {
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
}

const NewMenuClient: React.FC<NewMenuClientProps> = ({ selectedTopic, onTopicSelect }) => {
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/members", label: "Members" },
  ];

  const handleClick = (href: string) => {
    onTopicSelect(href);
  };

  return (
    <nav
      className="bg-blue-400 w-56 h-full fixed top-0 left-0 overflow-auto p-4"
      aria-label="Topics navigation"
    >
      <h2 className="text-white font-bold mb-6">Topics</h2>
      <ul className="flex flex-col space-y-2">
        {menuItems.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>
              {/* Note: next/link no longer requires <a> manually, but if you want styling, you can keep it */}
              <a
                className={`block px-4 py-2 rounded text-white hover:bg-blue-600 ${
                  selectedTopic === href ? "bg-blue-700 font-bold" : ""
                }`}
                onClick={() => handleClick(href)}
              >
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NewMenuClient;
