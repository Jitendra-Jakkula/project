import { useEffect, useState } from "react";
import api from "../services/api";
import ProblemCard from "../components/ProblemCard";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/problems");

        setProblems(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this problem?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/problems/${id}`);

      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== id),
      );
    } catch (error) {
      console.error("Failed to delete problem:", error);
    }
  };
const filteredProblems = problems.filter((problem) =>
  problem.title.toLowerCase().includes(search.toLowerCase())
);
  if (loading) {
    return <h2>Loading problems...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
  <div>
    <div>
  <h2>Problems</h2>

  <Link to="/add">
    + Add Problem
  </Link>
</div>

    <input
      type="text"
      placeholder="Search problems..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {problems.length === 0 ? (
      <div>
        <h3>No problems yet</h3>
        <p>Start adding problems to build your notebook.</p>
      </div>
    ) : filteredProblems.length === 0 ? (
      <div>
        <h3>No matching problems</h3>
        <p>Try a different search.</p>
      </div>
    ) : (
      filteredProblems.map((problem) => (
        <ProblemCard
          key={problem._id}
          problem={problem}
          onDelete={handleDelete}
        />
      ))
    )}
  </div>
);
};

export default Problems;
