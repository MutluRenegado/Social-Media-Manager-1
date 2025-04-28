'use client';

import React, { useState } from "react";
import { db } from "@/firebase"; // Adjust path if needed
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

interface CodeSplitterByDotProps {
  userId?: string;
}

export default function CodeSplitterByDot({ userId = "anonymous" }: CodeSplitterByDotProps) {
  const [code, setCode] = useState("");

  const handleSplitAndSend = async () => {
    if (!code.trim()) return;

    const mid = Math.floor(code.length / 2);
    let splitIndex = code.lastIndexOf(".", mid);

    if (splitIndex === -1) {
      splitIndex = code.indexOf(".", mid);
      if (splitIndex === -1) {
        splitIndex = mid;
      }
    }
    splitIndex += 1;

    const part1 = code.slice(0, splitIndex).trim();
    const part2 = code.slice(splitIndex).trim();

    try {
      const codePartsCollection = collection(db, "codes", userId, "codeParts");

      await setDoc(doc(codePartsCollection, "part1"), {
        text: part1,
        order: 1,
        userId,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(codePartsCollection, "part2"), {
        text: part2,
        order: 2,
        userId,
        createdAt: serverTimestamp(),
      });

      alert("Text parts sent to Firebase successfully!");
    } catch (error) {
      console.error("Error sending to Firebase: ", error);
      alert("Failed to send text parts.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <textarea
        rows={10}
        cols={80}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your text or code here..."
        className="w-full p-2 border border-gray-300 rounded resize-y font-mono"
      />
      <button
        onClick={handleSplitAndSend}
        className="mt-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Split & Send to Firebase
      </button>
    </div>
  );
}
