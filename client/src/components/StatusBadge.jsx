const StatusBadge = ({ status }) => {
    const statusText = status || "Not Started";

    return (
        <span>
            {statusText}
        </span>
    );
};

export default StatusBadge;