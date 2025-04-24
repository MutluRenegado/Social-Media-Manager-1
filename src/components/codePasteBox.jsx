import React, { useState } from "react";

export default function CodePasteBox() {
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    alert("Code pasted:\n\n" + code.slice(0, 300) + (code.length > 300 ? "..." : ""));
    // Here you can send `code` to your API or processing function
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <label htmlFor="codeInput" style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
        Paste your code below:
      </label>
      <textarea
        id="codeInput"
        value={code}
        onChange={handleChange}
        placeholder="Paste your code here..."
        rows={15}
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: 14,
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
          borderRadius: 6,
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
        }}
      >
        Submit Code
      </button>
    </div>
  );
}
