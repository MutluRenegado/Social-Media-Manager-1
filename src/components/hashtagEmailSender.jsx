import React, { useState } from "react";

export default function HashtagEmailSender() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState(null);

  const handleGenerateAndEmail = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hashtags-from-firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate hashtags");
      }

      const data = await response.json();
      setHashtags(data.hashtags.join(" "));
      alert("Hashtags generated and email sent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleGenerateAndEmail} disabled={loading}>
        {loading ? "Processing..." : "Generate Hashtags & Email"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {hashtags && (
        <div>
          <h3>Merged Hashtags:</h3>
          <p>{hashtags}</p>
        </div>
      )}
    </div>
  );
}
