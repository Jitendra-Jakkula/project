import { useEffect, useState } from "react";
import api from "../services/api";
import ProblemCard from "../components/ProblemCard";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("all");

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
const filteredProblems = problems.filter((problem) => {
  const matchesSearch = problem.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesDifficulty =
    difficulty === "all" ||
    problem.difficulty === difficulty;

  const matchesStatus =
    status === "all" ||
    problem.status === status;

  const matchesTopic =
    topic === "all" ||
    problem.topics?.includes(topic);

  return (
    matchesSearch &&
    matchesDifficulty &&
    matchesStatus &&
    matchesTopic
  );
});
  if (loading) {
    return <h2>Loading problems...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const clearFilters = () => {
  setSearch("");
  setDifficulty("all");
  setStatus("all");
  setTopic("all");
};

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
    <select
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
>
  
  <option value="all">All Difficulties</option>
  <option value="Easy">Easy</option>
  <option value="Medium">Medium</option>
  <option value="Hard">Hard</option>
</select>
<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="all">All Status</option>
  <option value="Not Solved">Not Solved</option>
  <option value="Solved">Solved</option>
  <option value="Revisit">Revisit</option>
</select>

<select
  value={topic}
  onChange={(e) => setTopic(e.target.value)}
>
  <option value="all">All Topics</option>
  <option value="Array">Array</option>
  <option value="Hash Table">Hash Table</option>
  <option value="DP">DP</option>
  <option value="Greedy">Greedy</option>
  <option value="Graph">Graph</option>
  <option value="Tree">Tree</option>
  <option value="Binary Search">Binary Search</option>
</select>

<button onClick={clearFilters}>
  Clear Filters
</button>
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
