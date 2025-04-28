// src/components/Illustrations.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";

const Illustrations = () => {
  return (
    <div className="p-6 flex justify-around items-center bg-gray-50 rounded-2xl shadow-lg">
      {illustrationItems.map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center space-y-2"
          whileHover={{ scale: 1.15 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
        >
          <item.icon className={`h-14 w-14 ${item.color}`} />
          <span className="text-sm font-semibold">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// List of icons and labels
const illustrationItems = [
  {
    label: "Idea",
    color: "text-yellow-400",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3a7 7 0 00-7 7c0 3.866 4 7 4 7h6s4-3.134 4-7a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4" />
      </svg>
    ),
  },
  {
    label: "Growth",
    color: "text-green-500",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-4 4 5 3-6" />
      </svg>
    ),
  },
  {
    label: "Profile",
    color: "text-blue-500",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
      </svg>
    ),
  },
];

export default Illustrations;
