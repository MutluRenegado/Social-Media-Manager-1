"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/members", label: "Members" },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-blue-500 text-white w-64 min-h-screen p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-50`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-bold">ANM Social</div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? "✖️" : "☰"}
          </button>
        </div>

        <ul className="space-y-4 mt-8">
          {menuItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-2 rounded hover:bg-blue-600 ${
                  isActive(href) ? "bg-blue-700 font-bold" : ""
                }`}
                onClick={() => windowWidth < 768 && setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {/* Your page content will go here */}
        <h1 className="text-3xl font-bold">Welcome to ANM Social 🚀</h1>
      </div>
    </div>
  );
};

export default Menu;
