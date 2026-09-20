import { useEffect,useRef, useState } from "react";
import api from "../services/api";
import ProblemCard from "../components/ProblemCard";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import ProblemCardSkeleton from "../components/ProblemCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmDialog from "../components/ConfirmDialog";




const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("all");
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [toast, setToast] = useState({
  message: "",
  type: "success",
});

const searchInputRef = useRef(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
  if (!toast.message) {
    return;
  }

  const timer = setTimeout(() => {
    setToast({
      message: "",
      type: "success",
    });
  }, 3000);

  return () => clearTimeout(timer);
}, [toast.message]);

useEffect(() => {
  const handleKeyDown = (event) => {
    if (
      event.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []);

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

const handleDelete = (problem) => {
setProblemToDelete(problem);
};

const confirmDelete = async () => {
  if (!problemToDelete) {
    return;
  }

  try {
    await api.delete(`/problems/${problemToDelete._id}`);

    setProblems((prevProblems) =>
      prevProblems.filter(
        (problem) => problem._id !== problemToDelete._id,
      ),
    );

    setToast({
      message: "Problem deleted successfully",
      type: "success",
    });

    setProblemToDelete(null);
  } catch (error) {
    setToast({
      message:
        error.response?.data?.message ||
        "Failed to delete problem",
      type: "error",
    });
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
  return (
    <div className="problem-list">
      <ProblemCardSkeleton />
      <ProblemCardSkeleton />
      <ProblemCardSkeleton />
    </div>
  );
}

  if (error) {
   if (error) {
  return (
    <ErrorState
      message={error}
      onRetry={fetchProblems}
    />
  );
}
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
      <Toast
  message={toast.message}
  type={toast.type}
  onClose={() =>
    setToast({
      message: "",
      type: "success",
    })
  }
/>

<ConfirmDialog
  open={Boolean(problemToDelete)}
  title="Delete problem?"
  message={
    problemToDelete
      ? `Are you sure you want to delete "${problemToDelete.title}"? This action cannot be undone.`
      : ""
  }
  confirmText="Delete"
  onConfirm={confirmDelete}
  onCancel={() => setProblemToDelete(null)}
/>
  <h2>Problems</h2>

  <Link to="/add">
    + Add Problem
  </Link>
</div>
<div className="filter-bar">
  <input
  ref={searchInputRef}
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

  <button
    type="button"
    onClick={clearFilters}
  >
    Clear
  </button>
</div>
    {problems.length === 0 ? (
      <EmptyState
  title="No problems yet"
  message="Start adding problems to build your coding notebook."
  action={
    <Link to="/add">
      <button type="button">
        + Add Problem
      </button>
    </Link>
  }
/>
    ) : filteredProblems.length === 0 ? (
      <EmptyState
  title="No matching problems"
  message="Try changing your search or clearing some filters."
  action={
    <button
      type="button"
      onClick={clearFilters}
    >
      Clear Filters
    </button>
  }
/>
    ) : (
  <div className="problem-list">
    {filteredProblems.map((problem) => (
      <ProblemCard
        key={problem._id}
        problem={problem}
        onDelete={handleDelete}
      />
    ))}
  </div>
)}
  </div>
);
};

export default Problems;
