import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import NotesEditor from "../components/NotesEditor";

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/problems/${id}`);

        setProblem(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load problem"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await api.put(`/problems/${id}`, {
        platform: problem.platform,
        problemId: problem.problemId,
        title: problem.title,
        url: problem.url,
        difficulty: problem.difficulty,
        topics: problem.topics,
        status: problem.status,
        notes:
          problem.notes === "<p></p>"
            ? ""
            : problem.notes,
      });

      setProblem(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save problem"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this problem?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/problems/${id}`);

      navigate("/problems");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete problem"
      );
    }
  };

  if (loading) {
    return <h2>Loading problem...</h2>;
  }

  if (error && !problem) {
    return <h2>{error}</h2>;
  }

  if (!problem) {
    return <h2>Problem not found</h2>;
  }

  return (
    <div>
      <Link to="/problems">
        ← Problems
      </Link>

      {/* Header */}
      <section>
        <h1>{problem.title}</h1>

        <p>#{problem.problemId}</p>

        <p>{problem.difficulty}</p>

        <p>
          {problem.topics?.join(" • ")}
        </p>

        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on LeetCode ↗
        </a>
      </section>

      {/* Notes */}
      <section>
        <h3>My Notes</h3>

        <NotesEditor
          content={problem.notes}
          onChange={(value) =>
            setProblem({
              ...problem,
              notes: value,
            })
          }
        />
      </section>

      {/* Status */}
      <section>
        <h3>Status</h3>

        <label>
          <input
            type="radio"
            value="Not Solved"
            checked={problem.status === "Not Solved"}
            onChange={(e) =>
              setProblem({
                ...problem,
                status: e.target.value,
              })
            }
          />
          Not Solved
        </label>

        <label>
          <input
            type="radio"
            value="Solved"
            checked={problem.status === "Solved"}
            onChange={(e) =>
              setProblem({
                ...problem,
                status: e.target.value,
              })
            }
          />
          Solved
        </label>

        <label>
          <input
            type="radio"
            value="Revisit"
            checked={problem.status === "Revisit"}
            onChange={(e) =>
              setProblem({
                ...problem,
                status: e.target.value,
              })
            }
          />
          Revisit
        </label>
      </section>

      {/* Error */}
      {error && <p>{error}</p>}

      {/* Actions */}
      <section>
        <button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button onClick={handleDelete}>
          Delete Problem
        </button>
      </section>
    </div>
  );
};

export default ProblemDetails;