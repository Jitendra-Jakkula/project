import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside>
            <h3>Menu</h3>

            <nav>
                <Link to="/">Dashboard</Link>
                <Link to="/problems">Problems</Link>
                <Link to="/add">Add Problem</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;