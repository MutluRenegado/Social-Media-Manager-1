import { useState } from "react";
import { uploadTiersToFirestore } from "lib/firebase/uploadTiers";

export default function UploadTiersPage() {
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    setStatus("Uploading...");
    try {
      await uploadTiersToFirestore();
      setStatus("✅ Tiers uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Failed to upload tiers.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Upload Tier Plans</h1>
      <p>Click the button below to upload the Free, Pro, and Elite plans to Firestore.</p>
      <button
        onClick={handleUpload}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#1e293b",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Upload Tiers
      </button>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}
