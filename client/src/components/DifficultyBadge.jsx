const DifficultyBadge = ({ difficulty }) => {
    return (
        <span>
            {difficulty || "Unknown"}
        </span>
    );
};

export default DifficultyBadge;