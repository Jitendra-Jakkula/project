import { useState } from "react";
import api from "../services/api";

import { useNavigate } from "react-router-dom";
const AddProblem = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [problem, setProblem] = useState(null);
  const [topic, setTopic] = useState("all");
  const navigate = useNavigate();
  
  const handleDetect = async () => {
  if (!url.trim()) {
    setError("Please enter a LeetCode URL");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setProblem(null);

    const response = await api.post("/problems/detect", {
      url,
    });

    setProblem(response.data.data);
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Failed to detect problem"
    );
  } finally {
    setLoading(false);
  }
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError("");

    const data = problem.problem;

    await api.post("/problems", {
      platform: problem.platform,
      problemId: data.problemId,
      title: data.title,
      url: data.url,
      difficulty: data.difficulty,
      topics: data.topics,
      status: "Not Solved",
      notes: "",
    });

    navigate("/problems");
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Failed to save problem"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h2>Add Problem</h2>

      <input
        type="text"
        placeholder="Paste LeetCode problem URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleDetect} disabled={loading}>
        {loading ? "Detecting..." : "Detect"}
      </button>

      {error && <p>{error}</p>}

      {problem && (
  <div>
    <h3>{problem.problem.title}</h3>

    <p>#{problem.problem.problemId}</p>

    <p>{problem.problem.difficulty}</p>

    <p>LeetCode</p>

    <p>
      {problem.problem.topics?.join(" • ")}
    </p>

    <button onClick={handleSave} disabled={loading}>
      {loading ? "Saving..." : "Save Problem"}
    </button>
  </div>
)}
    </div>
  );
};

export default AddProblem;