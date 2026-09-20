import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/problems"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Problems
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          + Add Problem
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
