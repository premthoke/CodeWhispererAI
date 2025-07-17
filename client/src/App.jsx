import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleExplain = async () => {
    setLoading(true);
    setExplanation("");

    try {
      const response = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setExplanation(data.explanation);
      } else {
        if (
          data.explanation?.toLowerCase().includes("rate") ||
          data.explanation?.toLowerCase().includes("limit")
        ) {
          setExplanation(
            "⚠️ The model is currently overloaded or rate-limited. Please try again after some time."
          );
        } else {
          setExplanation(data.explanation || "❌ Unexpected error occurred.");
        }
      }
    } catch (error) {
      console.error("Frontend error:", error.message);
      setExplanation("❌ Server unreachable or internal error.");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <button className="theme-toggle" onClick={handleThemeToggle}>
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>💡 CodeGPT Mentor</h1>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder='e.g., print("Hello World!")'
      />

      <br />

      <button onClick={handleExplain} disabled={loading}>
        {loading ? "Explaining..." : "Explain Code"}
      </button>

      {explanation && (
        <div
          className={`explanation-box ${
            explanation.includes("⚠️") || explanation.includes("❌")
              ? "error"
              : ""
          }`}
        >
          <h3>📄 Explanation:</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
