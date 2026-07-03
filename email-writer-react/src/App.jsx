import { useState } from "react";
import "./App.css";
import axios from "axios";

const TONES = [
  { label: "Default", value: "" },
  { label: "Professional", value: "professional" },
  { label: "Casual", value: "casual" },
  { label: "Friendly", value: "friendly" },
];

const LENGTHS = [
  { label: "Default", value: "" },
  { label: "Short", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Long", value: "long" },
];

function Spinner() {
  return <span className="spinner" />;
}

export default function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent.trim() || loading) return;
    setLoading(true);
    setError("");
    setGeneratedReply("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        { emailContent, tone, length }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (err) {
      setError(
        err.response?.data || "Failed to generate email reply. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="page">
      <div className="wrap">

        <div className="header">
          <h1>Email reply generator</h1>
          <p>Paste an email and get a polished reply in seconds.</p>
        </div>

        <div className="field">
          <label>Original email</label>
          <textarea
            rows={7}
            placeholder="Paste the email you want to reply to…"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <div className="char-count">{emailContent.length} characters</div>
        </div>

        <div className="field">
          <label>Tone</label>
          <div className="tone-row">
            {TONES.map(({ label, value }) => (
              <button
                key={value}
                className={`pill ${tone === value ? "active" : ""}`}
                onClick={() => setTone(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Length</label>
          <div className="tone-row">
            {LENGTHS.map(({ label, value }) => (
              <button
                key={value}
                className={`pill ${length === value ? "active" : ""}`}
                onClick={() => setLength(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-generate"
          disabled={!emailContent.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? <><Spinner /> Generating…</> : "Generate reply"}
        </button>

        {error && <p className="error-msg">{error}</p>}

        {generatedReply && (
          <>
            <hr className="divider" />
            <div className="output-header">
              <span className="output-label">Generated reply</span>
              <button
                className={`btn-copy ${copied ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "⎘ Copy"}
              </button>
            </div>
            <div className="output-box">{generatedReply}</div>
          </>
        )}

      </div>
    </div>
  );
}