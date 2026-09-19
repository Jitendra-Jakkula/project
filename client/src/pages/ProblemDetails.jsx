import { useParams } from "react-router-dom";

const ProblemDetails = () => {
    const { id } = useParams();

    return <h2>Problem Details — {id}</h2>;
};

export default ProblemDetails;