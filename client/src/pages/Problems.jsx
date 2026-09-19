import { useEffect, useState } from "react";
import api from "../services/api";

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/problems");

                setProblems(response.data.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load problems"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    if (loading) {
        return <h2>Loading problems...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h2>Problems</h2>

            {problems.length === 0 ? (
                <p>No problems found.</p>
            ) : (
                problems.map((problem) => (
                    <div key={problem._id}>
                        <h3>{problem.title}</h3>
                        <p>{problem.difficulty}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Problems;