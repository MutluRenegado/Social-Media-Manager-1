import React, { useState } from "react";
import { db } from "./firebase"; // Adjust path if needed
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CodeSplitterByDot({ userId = "anonymous" }) {
  const [code, setCode] = useState("");

  const handleSplitAndSend = async () => {
    if (!code) return;

    // Find split index based on last '.' near middle
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

      // Save part 1 with metadata
      await setDoc(doc(codePartsCollection, "part1"), {
        text: part1,
        order: 1,
        userId,
        createdAt: serverTimestamp(),
      });

      // Save part 2 with metadata
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
    <div>
      <textarea
        rows={10}
        cols={80}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your text or code here..."
      />
      <br />
      <button onClick={handleSplitAndSend}>Split & Send to Firebase</button>
    </div>
  );
}
