import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge";
import StatusBadge from "./StatusBadge";

const ProblemCard = ({ problem, onDelete }) => {
    return (
        <div>
            <h3>
                <Link to={`/problems/${problem._id}`}>
                    {problem.title}
                </Link>
            </h3>

            <p>
                <DifficultyBadge
                    difficulty={problem.difficulty}
                />
            </p>

            <p>
                Topics:{" "}
                {problem.topics?.length
                    ? problem.topics.join(" • ")
                    : "No topics"}
            </p>

            <p>
                Status:{" "}
                <StatusBadge status={problem.status} />
            </p>

            <button onClick={() => onDelete(problem._id)}>
                Delete
            </button>
        </div>
    );
};

export default ProblemCard;