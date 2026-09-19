import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>
            <h2>Problem Notebook</h2>

            <div>
                <Link to="/">Home</Link>
                {" | "}
                <Link to="/problems">Problems</Link>
                {" | "}
                <Link to="/add">Add Problem</Link>

                {user && (
                    <>
                        {" | "}
                        <span>{user.name}</span>
                        {" | "}
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;