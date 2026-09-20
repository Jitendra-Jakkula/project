import { Link } from "react-router-dom";

const ProblemCard = ({ problem, onDelete }) => {
  return (
    <div className="problem-card">
      <div className="problem-card-main">
        <h3>
          <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
        </h3>

        <p>
          #{problem.problemId} • {problem.platform}
        </p>

        <div className="problem-topics">
          {problem.topics?.map((topic) => (
            <span key={topic} className="topic-tag">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="problem-card-side">
        <span
          className={`difficulty difficulty-${problem.difficulty?.toLowerCase()}`}
        >
          {problem.difficulty}
        </span>

        <span className="status">{problem.status}</span>

        <button
          type="button"
          className="btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(problem);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
